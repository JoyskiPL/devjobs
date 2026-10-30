
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

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
    PENDING: "border-yellow-700 bg-yellow-950 text-yellow-300",
    ACCEPTED: "border-emerald-700 bg-emerald-950 text-emerald-300",
    REJECTED: "border-red-700 bg-red-950 text-red-300",
  };

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          ← Powrót do ofert
        </Link>

        <h1 className="mt-6 text-3xl font-bold">
          Moje aplikacje
        </h1>

        <p className="mt-2 text-zinc-400">
          Tutaj znajdziesz oferty, na które aplikowałeś, i aktualny status każdej aplikacji.
        </p>

        {applications.length === 0 ? (
          <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-zinc-300">
              Nie aplikowałeś jeszcze na żadną ofertę.
            </p>

            <Link
              href="/"
              className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 font-medium hover:bg-blue-500"
            >
              Przeglądaj oferty
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {applications.map((application) => (
              <article
                key={application.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="text-xl font-semibold">
                    {application.job.title}
                  </h2>

                  <span
                    className={`rounded-full border px-3 py-1 text-sm ${
                      statusColors[application.status]
                    }`}
                  >
                    {statusLabels[application.status]}
                  </span>
                </div>

                <p className="mt-2 text-zinc-300">
                  {application.job.company} · {application.job.location}
                </p>

                <p className="mt-3 text-sm text-zinc-500">
                  Aplikowano:{" "}
                  {application.createdAt.toLocaleDateString("pl-PL")}
                </p>

                <Link
                  href={`/jobs/${application.job.id}`}
                  className="mt-4 inline-block text-sm text-blue-400 hover:text-blue-300"
                >
                  Zobacz ofertę →
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
