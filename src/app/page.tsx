
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const jobs = await prisma.job.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-gray-950 p-8 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold">DevJobs</h1>

        <p className="mt-3 text-gray-400">
          Znajdź swoją następną pracę w IT.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">
          Oferty pracy ({jobs.length})
        </h2>

        <div className="mt-6 space-y-4">
          {jobs.map((job) => (
            <article
              key={job.id}
              className="rounded-xl border border-gray-800 bg-gray-900 p-6"
            >
              <h3 className="text-xl font-bold">{job.title}</h3>

              <p className="mt-2 text-gray-300">
                {job.company} · {job.location}
              </p>

              <p className="mt-4 leading-7 text-gray-400">
                {job.description}
              </p>

              <p className="mt-4 text-sm text-gray-500">
                Dodano: {job.createdAt.toLocaleDateString("pl-PL")}
              </p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
