
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function JobsPage() {
  const jobs = await prisma.job.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-sm text-blue-400 hover:underline">
          ← Strona główna
        </Link>

        <div className="mt-6">
          <h1 className="text-3xl font-bold sm:text-4xl">
            Oferty pracy
          </h1>
          <p className="mt-3 text-zinc-400">
            Znajdź stanowisko dopasowane do swoich umiejętności.
          </p>
        </div>

        {jobs.length === 0 ? (
          <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-zinc-300">
              Nie ma jeszcze żadnych ofert pracy.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {jobs.map((job) => (
              <article
                key={job.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-blue-500"
              >
                <h2 className="text-xl font-semibold">{job.title}</h2>
                <p className="mt-2 text-zinc-300">
                  {job.company} · {job.location}
                </p>
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-zinc-400">
                  {job.description}
                </p>
                <Link
                  href={`/jobs/${job.id}`}
                  className="mt-5 inline-block rounded-lg bg-blue-600 px-4 py-2 font-medium transition hover:bg-blue-500"
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
