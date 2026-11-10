
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import ToggleJobButton from "./toggle-job-button";
import ExportAllApplicationsButton from "./export-all-applications-button";

export default async function EmployerPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "EMPLOYER") {
    redirect("/");
  }

  const jobs = await prisma.job.findMany({
    where: {
      employerId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          applications: true,
        },
      },
    },
  });

  const totalApplications = jobs.reduce(
    (total, job) => total + job._count.applications,
    0,
  );
  const allApplications = await prisma.application.findMany({
    where: {
      job: {
        employerId: session.user.id,
      },
    },
    include: {
      job: {
        select: {
          title: true,
        },
      },
      candidate: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const exportApplications = allApplications.map((application) => ({
    jobTitle: application.job.title,
    candidateName:
      application.candidate.name || "Kandydat bez podanego imienia",
    email: application.candidate.email || "Brak adresu e-mail",
    createdAt: application.createdAt.toLocaleDateString("pl-PL"),
    status: application.status,
  }));
  const [
    pendingApplications,
    acceptedApplications,
    rejectedApplications,
  ] = await Promise.all([
    prisma.application.count({
      where: {
        job: {
          employerId: session.user.id,
        },
        status: "PENDING",
      },
    }),
    prisma.application.count({
      where: {
        job: {
          employerId: session.user.id,
        },
        status: "ACCEPTED",
      },
    }),
    prisma.application.count({
      where: {
        job: {
          employerId: session.user.id,
        },
        status: "REJECTED",
      },
    }),
  ]);

  const activeJobs = jobs.filter((job) => job.isActive).length;
  const hiddenJobs = jobs.length - activeJobs;

  const totalViews = jobs.reduce(
    (total, job) => total + job.views,
    0,
  );

  const conversionRate =
    totalViews > 0
      ? ((totalApplications / totalViews) * 100).toFixed(1)
      : "0.0";

  const today = new Date();

  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const recentApplications = await prisma.application.findMany({
    where: {
      job: {
        employerId: session.user.id,
      },
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
    select: {
      createdAt: true,
    },
  });

  const applicationActivity = Array.from(
    { length: 7 },
    (_, index) => {
      const date = new Date(sevenDaysAgo);
      date.setDate(sevenDaysAgo.getDate() + index);

      const count = recentApplications.filter((application) => {
        return (
          application.createdAt.getFullYear() === date.getFullYear() &&
          application.createdAt.getMonth() === date.getMonth() &&
          application.createdAt.getDate() === date.getDate()
        );
      }).length;

      return {
        date: date.toLocaleDateString("pl-PL", {
          day: "2-digit",
          month: "2-digit",
        }),
        count,
      };
    },
  );

  const maxDailyApplications = Math.max(
    ...applicationActivity.map((day) => day.count),
    1,
  );
  const topJobs = [...jobs]
    .sort(
      (a, b) =>
        b._count.applications - a._count.applications ||
        b.views - a.views,
    )
    .slice(0, 5);
  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-12 text-white sm:px-6">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-sm font-medium text-blue-400">
              DevJobs / Pracodawca
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Panel pracodawcy
            </h1>

            <p className="mt-3 text-zinc-400">
              Zarządzaj ofertami pracy i rekrutacją w jednym miejscu.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
          {allApplications.length > 0 && (
            <ExportAllApplicationsButton
              applications={exportApplications}
            />
          )}

          <Button asChild>
            <Link href="/employer/new">
              + Dodaj ofertę pracy
            </Link>
          </Button>
        </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="text-sm text-zinc-400">Wszystkie oferty</p>
            <p className="mt-3 text-3xl font-bold">{jobs.length}</p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="text-sm text-zinc-400">Aktywne oferty</p>
            <p className="mt-3 text-3xl font-bold text-emerald-400">{activeJobs}</p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="text-sm text-zinc-400">Ukryte oferty</p>
            <p className="mt-3 text-3xl font-bold text-amber-400">{hiddenJobs}</p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="text-sm text-zinc-400">Wszystkie zgłoszenia</p>
            <p className="mt-3 text-3xl font-bold">{totalApplications}</p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="text-sm text-zinc-400">Oczekujące</p>
            <p className="mt-3 text-3xl font-bold text-amber-400">{pendingApplications}</p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="text-sm text-zinc-400">Zaakceptowane</p>
            <p className="mt-3 text-3xl font-bold text-emerald-400">{acceptedApplications}</p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <p className="text-sm text-zinc-400">Odrzucone</p>
            <p className="mt-3 text-3xl font-bold text-red-400">{rejectedApplications}</p>
          </div>

          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-6">
            <p className="text-sm text-zinc-400">
              Skuteczność rekrutacji
            </p>

            <p className="mt-3 text-3xl font-bold text-blue-400">
              {conversionRate}%
            </p>

            <p className="mt-2 text-xs text-zinc-500">
              Stosunek zgłoszeń do wyświetleń ofert
            </p>
          </div>
        </div>

        <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Aktywność rekrutacyjna
            </h2>

            <p className="mt-1 text-sm text-zinc-400">
              Nowe zgłoszenia w ostatnich 7 dniach
            </p>
          </div>

          <div className="mt-8 grid grid-cols-7 items-end gap-3">
            {applicationActivity.map((day) => (
              <div
                key={day.date}
                className="flex flex-col items-center gap-3"
              >
                <span className="text-xs text-zinc-400">
                  {day.count}
                </span>

                <div className="flex h-40 w-full items-end rounded-md bg-zinc-950">
                  <div
                    className="w-full rounded-md bg-blue-500 transition-all"
                    style={{
                      height: `${(day.count / maxDailyApplications) * 100}%`,
                      minHeight: day.count > 0 ? "6px" : "0px",
                    }}
                  />
                </div>

                <span className="text-xs text-zinc-500">
                  {day.date}
                </span>
              </div>
            ))}
          </div>
        </section>
<section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
  <div>
    <h2 className="text-lg font-semibold text-white">
      Najpopularniejsze oferty
    </h2>

    <p className="mt-1 text-sm text-zinc-400">
      Ranking ofert według liczby zgłoszeń i wyświetleń
    </p>
  </div>

  {topJobs.length === 0 ? (
    <p className="mt-6 text-sm text-zinc-500">
      Nie masz jeszcze ofert do wyświetlenia.
    </p>
  ) : (
    <div className="mt-6 space-y-4">
      {topJobs.map((job, index) => {
        const jobConversionRate =
          job.views > 0
            ? ((job._count.applications / job.views) * 100).toFixed(1)
            : "0.0";

        return (
          <div
            key={job.id}
            className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 font-bold text-blue-400">
                  {index + 1}
                </span>

                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-white">
                    {job.title}
                  </h3>

                  <p className="text-sm text-zinc-500">
                    {job.company}
                  </p>
                </div>
              </div>

              <span className="text-xs text-zinc-500">
                {job.isActive ? "Aktywna" : "Nieaktywna"}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-zinc-500">Wyświetlenia</p>
                <p className="mt-1 text-xl font-semibold">
                  {job.views}
                </p>
              </div>

              <div>
                <p className="text-xs text-zinc-500">Zgłoszenia</p>
                <p className="mt-1 text-xl font-semibold text-emerald-400">
                  {job._count.applications}
                </p>
              </div>

              <div>
                <p className="text-xs text-zinc-500">Skuteczność</p>
                <p className="mt-1 text-xl font-semibold text-blue-400">
                  {jobConversionRate}%
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  )}
</section>
        <section>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">
                Twoje oferty pracy
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Zarządzaj opublikowanymi ogłoszeniami.
              </p>
            </div>

            <span className="text-sm text-zinc-500">
              {jobs.length} {jobs.length === 1 ? "oferta" : "ofert"}
            </span>
          </div>

          {jobs.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/50 p-10 text-center">
              <h3 className="text-lg font-semibold">
                Nie masz jeszcze żadnych ofert
              </h3>

              <p className="mt-2 text-sm text-zinc-400">
                Dodaj pierwszą ofertę, aby rozpocząć rekrutację.
              </p>

              <Button asChild className="mt-5">
                <Link href="/employer/new">
                  Dodaj pierwszą ofertę
                </Link>
              </Button>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {jobs.map((job) => (
                <article
                  key={job.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition-colors hover:border-zinc-700 sm:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold">
                        {job.title}
                      </h3>

                      <p className="mt-1 text-sm text-zinc-400">
                        {job.company} · {job.location}
                      </p>

                      <span
                        className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                          job.moderationStatus === "REJECTED"
                            ? "border-red-500/30 bg-red-500/10 text-red-400"
                            : job.moderationStatus === "PENDING"
                              ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                              : job.isActive
                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                                : "border-zinc-500/30 bg-zinc-500/10 text-zinc-400"
                        }`}
                      >
                        {job.moderationStatus === "REJECTED"
                          ? "Odrzucona"
                          : job.moderationStatus === "PENDING"
                            ? "Oczekuje na moderację"
                            : job.isActive
                              ? "Aktywna"
                              : "Ukryta"}
                      </span>

                      {job.moderationStatus === "REJECTED" &&
                        job.moderationReason && (
                          <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                            <p className="text-xs font-semibold text-red-400">
                              Powód odrzucenia:
                            </p>

                            <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-300">
                              {job.moderationReason}
                            </p>
                          </div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <div className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm">
                        <span className="font-semibold">
                          {job.views}
                        </span>{" "}
                        <span className="text-zinc-400">
                          wyświetleń
                        </span>
                      </div>

                      <div className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm">
                        <span className="font-semibold">
                          {job._count.applications}
                        </span>{" "}
                        <span className="text-zinc-400">
                          zgłoszeń
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-zinc-400">
                    {job.description}
                  </p>

                  <p className="mt-4 text-xs text-zinc-500">
                    Dodano: {job.createdAt.toLocaleDateString("pl-PL")}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3 border-t border-zinc-800 pt-5">
                    <Button asChild>
                      <Link
                        href={`/employer/jobs/${job.id}/applications`}
                      >
                        Zobacz zgłoszenia ({job._count.applications})
                      </Link>
                    </Button>

                    <Button asChild variant="outline">
                      <Link href={`/employer/jobs/${job.id}/edit`}>
                        Edytuj ofertę
                      </Link>
                    </Button>

                    {job.moderationStatus === "APPROVED" && (
                      <ToggleJobButton
                        id={job.id}
                        isActive={job.isActive}
                      />
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
