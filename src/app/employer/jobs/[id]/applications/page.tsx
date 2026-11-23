
import Link from "next/link";
import { requireEmployer } from "@/lib/employer";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import StatusForm from "./status-form";
import ExportButton from "./export-button";
import ApplicationsDateFilter from "./applications-date-filter";

type ApplicationsPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    from?: string;
    to?: string;
  }>;
};

export default async function ApplicationsPage({
  params,
  searchParams,
}: ApplicationsPageProps) {
  const user = await requireEmployer();
  const { id } = await params;
  const jobId = Number(id);
  const { from, to } = await searchParams;
  const validDate = (value?: string) => {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return null;
    }

    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return date;
  };

const fromDate = validDate(from);
const toDate = validDate(to);

const dateRangeIsValid =
  !fromDate || !toDate || fromDate <= toDate;

const dateFilter =
  dateRangeIsValid && (fromDate || toDate)
    ? {
        createdAt: {
          ...(fromDate && { gte: fromDate }),
          ...(toDate && {
            lt: new Date(toDate.getTime() + 24 * 60 * 60 * 1000),
          }),
        },
      }
    : {};

  if (!Number.isInteger(jobId) || jobId <= 0) {
    notFound();
  }

  const job = await prisma.job.findFirst({
    where: {
      id: jobId,
      employerId: user.id,
    },
    include: {
      applications: {
      where: dateFilter,
      orderBy: {
        createdAt: "desc",
      },
        include: {
          candidate: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!job) {
    notFound();
  }

  const statusLabels = {
    PENDING: "Oczekuje",
    ACCEPTED: "Zaakceptowane",
    REJECTED: "Odrzucone",
  };

  const statusColors = {
    PENDING: "border-yellow-700 bg-yellow-950 text-yellow-300",
    ACCEPTED: "border-emerald-700 bg-emerald-950 text-emerald-300",
    REJECTED: "border-red-700 bg-red-950 text-red-300",
  };

  const pendingCount = job.applications.filter(
    (application) => application.status === "PENDING",
  ).length;

  const acceptedCount = job.applications.filter(
    (application) => application.status === "ACCEPTED",
  ).length;

  const rejectedCount = job.applications.filter(
    (application) => application.status === "REJECTED",
  ).length;
  const exportApplications = job.applications.map((application) => ({
    candidateName:
      application.candidate.name || "Kandydat bez podanego imienia",
    email: application.candidate.email || "Brak adresu e-mail",
    createdAt: application.createdAt.toLocaleDateString("pl-PL"),
    status: application.status,
  }));
  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-12 text-white sm:px-6">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <Button asChild variant="ghost" className="-ml-3 text-zinc-400 hover:text-white">
            <Link href="/employer">
              ← Powrót do panelu pracodawcy
            </Link>
          </Button>

          <div className="mt-6">
            <p className="text-sm font-medium text-blue-400">
              DevJobs / Rekrutacja
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Zgłoszenia kandydatów
            </h1>

            <h2 className="mt-3 text-xl font-medium text-zinc-300">
              {job.title}
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              {job.company} · {job.location}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <p className="text-sm text-zinc-400">Wszystkie zgłoszenia</p>
            <p className="mt-3 text-3xl font-bold">
              {job.applications.length}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <p className="text-sm text-zinc-400">Oczekujące</p>
            <p className="mt-3 text-3xl font-bold text-yellow-400">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <p className="text-sm text-zinc-400">Zaakceptowane</p>
            <p className="mt-3 text-3xl font-bold text-emerald-400">
              {acceptedCount}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <p className="text-sm text-zinc-400">Odrzucone</p>
            <p className="mt-3 text-3xl font-bold text-red-400">
              {rejectedCount}
            </p>
          </div>
        </div>

        <section className="space-y-5">
        <ApplicationsDateFilter />
         <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">
              Lista kandydatów
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Przeglądaj zgłoszenia i aktualizuj ich statusy.
            </p>
          </div>

          {job.applications.length > 0 && (
            <ExportButton
              applications={exportApplications}
              jobTitle={job.title}
            />
          )}
        </div>

          {job.applications.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/50 p-10 text-center">
              <h3 className="text-lg font-semibold">
                Brak zgłoszeń
              </h3>

              <p className="mt-2 text-sm text-zinc-400">
                Na tę ofertę nie ma jeszcze żadnych zgłoszeń.
              </p>

              <Button asChild variant="outline" className="mt-5">
                <Link href="/employer">
                  Wróć do ofert
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {job.applications.map((application) => (
                <article
                  key={application.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {application.candidate.name ||
                          "Kandydat bez podanego imienia"}
                      </h3>

                      <p className="mt-1 text-sm text-zinc-400">
                        {application.candidate.email ||
                          "Brak adresu e-mail"}
                      </p>
                    </div>

                    <span
                      className={`rounded-full border px-3 py-1 text-sm font-medium ${
                        statusColors[application.status]
                      }`}
                    >
                      {statusLabels[application.status]}
                    </span>
                  </div>

                  <p className="mt-4 text-xs text-zinc-500">
                    Data aplikacji:{" "}
                    {application.createdAt.toLocaleDateString("pl-PL")}
                  </p>

                  <div className="mt-5 border-t border-zinc-800 pt-4">
                    <p className="mb-3 text-sm font-medium">
                      Zmień status zgłoszenia
                    </p>

                    <StatusForm
                      applicationId={application.id}
                      jobId={job.id}
                      status={application.status}
                    />
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
