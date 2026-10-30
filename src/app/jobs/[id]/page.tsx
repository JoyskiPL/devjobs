
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { applyToJob } from "../actions";

type JobPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function JobPage({ params, searchParams }: JobPageProps) {
  const { id } = await params;
  const { error } = await searchParams;
  const jobId = Number(id);

  if (!Number.isInteger(jobId) || jobId <= 0) {
    notFound();
  }

  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
  });

  if (!job) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-950 p-8 text-white">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          ← Powrót do ofert
        </Link>

        <article className="mt-6 rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h1 className="text-3xl font-bold">{job.title}</h1>

          <p className="mt-3 text-gray-300">
            {job.company} · {job.location}
          </p>

          <p className="mt-6 whitespace-pre-wrap leading-7 text-gray-300">
            {job.description}
          </p>

          <p className="mt-6 text-sm text-gray-500">
            Dodano: {job.createdAt.toLocaleDateString("pl-PL")}
          </p>

          <form action={applyToJob} className="mt-6">
            <input type="hidden" name="jobId" value={job.id} />

            {error === "already-applied" && (
              <p className="mt-4 rounded-lg border border-amber-800 bg-amber-950 p-3 text-sm text-amber-300">
                Już aplikowałeś na tę ofertę.
              </p>
            )}

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-500"
            >
              Aplikuj na to stanowisko
            </button>
          </form>
        </article>
      </div>
    </main>
  );
}
