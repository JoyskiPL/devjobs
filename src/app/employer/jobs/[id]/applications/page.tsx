
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import StatusForm from "./status-form";

type ApplicationsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ApplicationsPage({
  params,
}: ApplicationsPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "EMPLOYER") {
    redirect("/");
  }

  const { id } = await params;
  const jobId = Number(id);

  if (!Number.isInteger(jobId) || jobId <= 0) {
    notFound();
  }

  const job = await prisma.job.findFirst({
    where: {
      id: jobId,
      employerId: session.user.id,
    },
    include: {
      applications: {
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

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <a
          href="/employer"
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          ← Powrót do panelu pracodawcy
        </a>

        <h1 className="mt-6 text-3xl font-bold">
          Zgłoszenia kandydatów
        </h1>

        <h2 className="mt-2 text-xl text-zinc-300">
          {job.title}
        </h2>

        <p className="mt-2 text-sm text-zinc-400">
          {job.company} · {job.location}
        </p>

        <p className="mt-4 text-zinc-400">
          Liczba zgłoszeń: {job.applications.length}
        </p>

        {job.applications.length === 0 ? (
          <p className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900 p-5 text-zinc-400">
            Na tę ofertę nie ma jeszcze żadnych zgłoszeń.
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {job.applications.map((application) => (
              <article
                key={application.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold">
                    {application.candidate.name ||
                      "Kandydat bez podanego imienia"}
                  </h3>

                  <span
                    className={`rounded-full border px-3 py-1 text-sm ${
                      statusColors[application.status]
                    }`}
                  >
                    {statusLabels[application.status]}
                  </span>
                </div>

                <p className="mt-2 text-sm text-zinc-300">
                  E-mail:{" "}
                  {application.candidate.email || "Brak adresu e-mail"}
                </p>

                <p className="mt-3 text-xs text-zinc-500">
                  Data aplikacji:{" "}
                  {application.createdAt.toLocaleDateString("pl-PL")}
                </p>

                <div className="mt-5 border-t border-zinc-800 pt-4">
                  <p className="mb-3 text-sm font-medium text-zinc-300">
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
      </div>
    </main>
  );
}
