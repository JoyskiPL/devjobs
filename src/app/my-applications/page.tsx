
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function MyApplicationsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "CANDIDATE") {
    redirect("/");
  }

  const applications = await prisma.application.findMany({
    where: {
      candidateId: session.user.id,
    },
    include: {
      job: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const statusLabels = {
    PENDING: "Oczekuje na rozpatrzenie",
    ACCEPTED: "Zaakceptowana",
    REJECTED: "Odrzucona",
  };

  const statusColors = {
    PENDING:
      "border-amber-500/20 bg-amber-500/10 text-amber-300",
    ACCEPTED:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    REJECTED:
      "border-red-500/20 bg-red-500/10 text-red-300",
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 px-4 py-12 text-white sm:px-6">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="relative mx-auto max-w-5xl">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <span>←</span>
          Powrót do ofert
        </Link>

        <div className="mt-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-blue-400">
              DevJobs / Panel kandydata
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Moje <span className="text-blue-400">aplikacje</span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
              Śledź swoje zgłoszenia, sprawdzaj status rekrutacji i miej
              wszystkie aplikacje w jednym miejscu.
            </p>
          </div>

          <div className="flex w-fit items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/70 px-5 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <span className="text-lg font-bold">
                {applications.length}
              </span>
            </div>

            <div>
              <p className="text-xs text-zinc-500">
                Wszystkie aplikacje
              </p>
            </div>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-800 text-2xl">
              <span>📄</span>
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              Nie masz jeszcze żadnych aplikacji
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-400">
              Przeglądaj dostępne oferty pracy i znajdź stanowisko,
              które odpowiada Twoim umiejętnościom.
            </p>

            <Button asChild className="mt-7 bg-blue-600 text-white hover:bg-blue-500">
              <Link href="/jobs">
                Przeglądaj oferty pracy
              </Link>
            </Button>
          </div>
        ) : (
          <div className="mt-10 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-zinc-300">
                Historia zgłoszeń
              </h2>

              <span className="text-xs text-zinc-500">
                Najnowsze jako pierwsze
              </span>
            </div>

            {applications.map((application) => (
              <article
                key={application.id}
                className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 transition-all duration-200 hover:border-blue-500/30 hover:bg-zinc-900/80 sm:p-6"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold tracking-tight transition group-hover:text-blue-300 sm:text-xl">
                      {application.job.title}
                    </h3>

                    <p className="mt-2 text-sm text-zinc-300">
                      {application.job.company}
                    </p>

                    <p className="mt-1 text-sm text-zinc-500">
                      {application.job.location}
                    </p>
                  </div>

                  <span
                    className={`w-fit shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium ${
                      statusColors[application.status]
                    }`}
                  >
                    {statusLabels[application.status]}
                  </span>
                </div>

                <div className="mt-6 flex flex-col gap-4 border-t border-zinc-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs text-zinc-500">
                      Data wysłania zgłoszenia
                    </p>

                    <p className="mt-1 text-sm font-medium text-zinc-300">
                      {application.createdAt.toLocaleDateString("pl-PL", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-zinc-700 bg-zinc-950/50 text-zinc-200 hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-300"
                  >
                    <Link href={`/jobs/${application.job.slug ?? application.job.id}`}>
                      Zobacz ofertę →
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
