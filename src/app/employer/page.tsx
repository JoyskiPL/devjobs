import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

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


  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">

<div className="flex flex-wrap items-center justify-between gap-4">
  <h1 className="text-3xl font-bold">Panel pracodawcy</h1>

  <a
    href="/employer/new"
    className="inline-block rounded-lg bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500"
  >
    + Dodaj ofertę pracy
  </a>
</div>

<p className="mt-3 text-zinc-400">
  Tutaj możesz zarządzać swoimi ofertami pracy.
</p>


        <div className="mt-8">
          <h2 className="text-xl font-semibold">
            Twoje oferty pracy ({jobs.length})
          </h2>

          {jobs.length === 0 ? (
            <p className="mt-4 text-zinc-400">
              Nie masz jeszcze żadnych ofert pracy.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {jobs.map((job) => (
                <article
                  key={job.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 p-5"
                >
                  <h3 className="text-lg font-semibold">{job.title}</h3>

                  <p className="mt-1 text-sm text-zinc-400">
                    {job.company} · {job.location}
                  </p>

                  <p className="mt-3 whitespace-pre-wrap text-zinc-300">
                    {job.description}
                  </p>

                  <p className="mt-3 text-xs text-zinc-500">
                    Dodano: {job.createdAt.toLocaleDateString("pl-PL")}
                  </p>
                  <p className="mt-2 text-sm text-zinc-300">
                    Liczba zgłoszeń: {job._count.applications}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href={`/employer/jobs/${job.id}/applications`}
                      className="inline-block rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium hover:bg-emerald-500"
                    >
                      Zobacz zgłoszenia ({job._count.applications})
                    </a>

                    <a
                      href={`/employer/jobs/${job.id}/edit`}
                      className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500"
                    >
                      Edytuj
                    </a>

                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}