
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { removeSavedJob } from "../jobs/saved-actions";

export default async function SavedJobsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "CANDIDATE") {
    redirect("/");
  }

  const savedJobs = await prisma.savedJob.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      job: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]" />

      <div className="relative mx-auto max-w-5xl">
        <div className="mb-10">
          <Link
            href="/jobs"
            className="mb-6 inline-flex text-sm text-zinc-400 transition hover:text-white"
          >
            ← Wróć do ofert pracy
          </Link>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-sm font-medium text-blue-400">
                TWOJE KONTO
              </p>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Zapisane oferty
              </h1>

              <p className="mt-3 text-zinc-400">
                Oferty pracy, które chcesz zachować na później.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 px-5 py-3">
              <p className="text-sm text-zinc-400">Liczba zapisanych ofert</p>
              <p className="mt-1 text-2xl font-bold">{savedJobs.length}</p>
            </div>
          </div>
        </div>

        {savedJobs.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 px-6 py-16 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800 text-3xl">
              ♡
            </div>

            <h2 className="text-xl font-semibold">
              Nie masz jeszcze zapisanych ofert
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-400">
              Przeglądaj dostępne ogłoszenia i zapisuj te, do których chcesz
              wrócić później.
            </p>

            <Button asChild className="mt-6">
              <Link href="/jobs">Przeglądaj oferty</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {savedJobs.map((savedJob) => (
              <article
                key={savedJob.id}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:border-zinc-700 sm:p-6"
              >
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/jobs/${savedJob.job.id}`}
                      className="text-lg font-semibold transition hover:text-blue-400 sm:text-xl"
                    >
                      {savedJob.job.title}
                    </Link>

                    <p className="mt-2 text-sm text-zinc-400">
                      {savedJob.job.company}
                      {savedJob.job.location
                        ? ` · ${savedJob.job.location}`
                        : ""}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {savedJob.job.category && (
                        <span className="rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
                          {savedJob.job.category}
                        </span>
                      )}

                      {savedJob.job.employmentType && (
                        <span className="rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
                          {savedJob.job.employmentType}
                        </span>
                      )}

                      {savedJob.job.workMode && (
                        <span className="rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
                          {savedJob.job.workMode}
                        </span>
                      )}
                    </div>

                    <p className="mt-4 text-xs text-zinc-500">
                      Zapisano:{" "}
                      {new Intl.DateTimeFormat("pl-PL", {
                        dateStyle: "medium",
                      }).format(savedJob.createdAt)}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col gap-2 sm:w-44">
                    <Button asChild className="w-full">
                      <Link href={`/jobs/${savedJob.job.id}`}>
                        Zobacz ofertę
                      </Link>
                    </Button>

                    <form action={removeSavedJob}>
                      <input
                        type="hidden"
                        name="jobId"
                        value={savedJob.job.id}
                      />

                      <Button
                        type="submit"
                        variant="outline"
                        className="w-full border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white"
                      >
                        Usuń z zapisanych
                      </Button>
                    </form>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
