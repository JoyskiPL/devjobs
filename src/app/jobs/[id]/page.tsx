
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { applyToJob } from "../actions";
import { toggleSavedJob } from "../saved-actions";
import { Button } from "@/components/ui/button";

type JobPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

const categoryLabels: Record<string, string> = {
  IT: "IT",
  FINANCE: "Finanse",
  MARKETING: "Marketing",
  LOGISTICS: "Logistyka",
  ADMINISTRATION: "Administracja",
  ENGINEERING: "Inżynieria",
  OTHER: "Inne",
};

const employmentLabels: Record<string, string> = {
  FULL_TIME: "Pełny etat",
  PART_TIME: "Niepełny etat",
  CONTRACT: "B2B",
  MANDATE: "Umowa zlecenie",
  INTERNSHIP: "Staż",
};

const workModeLabels: Record<string, string> = {
  REMOTE: "Zdalna",
  HYBRID: "Hybrydowa",
  OFFICE: "Stacjonarna",
};

function formatSalary(
  salaryMin: number | null,
  salaryMax: number | null,
  salaryCurrency: string | null
) {
  if (
    salaryMin === null ||
    salaryMax === null ||
    !salaryCurrency
  ) {
    return null;
  }

  const formatter = new Intl.NumberFormat("pl-PL", {
    maximumFractionDigits: 0,
  });

  return `${formatter.format(salaryMin)}–${formatter.format(salaryMax)} ${salaryCurrency}`;
}

export default async function JobPage({
  params,
  searchParams,
}: JobPageProps) {
  const { id } = await params;
  const { error } = await searchParams;
  const jobId = Number(id);

const job = await prisma.job.findFirst({
  where: {
    isActive: true,
    OR: [
      { slug: id },
      ...(Number.isInteger(jobId) && jobId > 0
        ? [{ id: jobId }]
        : []),
    ],
  },
  include: {
    employer: {
      select: {
        companyProfile: {
          select: {
            slug: true,
          },
        },
      },
    },
  },
});

if (!job) {
  const oldSlug = await prisma.jobSlugHistory.findUnique({
    where: {
      slug: id,
    },
    include: {
      job: true,
    },
  });

  if (oldSlug?.job.isActive && oldSlug.job.slug) {
    redirect(`/jobs/${oldSlug.job.slug}`);
  }

  notFound();
}

if (job.slug && id !== job.slug) {
  redirect(`/jobs/${job.slug}`);
}

await prisma.job.update({
  where: {
    id: job.id,
  },
  data: {
    views: {
      increment: 1,
    },
  },
});

  const session = await auth();

  const isCandidate = session?.user?.role === "CANDIDATE";

  const savedJob = isCandidate
    ? await prisma.savedJob.findUnique({
        where: {
          userId_jobId: {
            userId: session.user.id,
            jobId: job.id,
          },
        },
      })
    : null;

  const salary = formatSalary(
    job.salaryMin,
    job.salaryMax,
    job.salaryCurrency
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 px-4 py-12 text-white sm:px-6">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]" />

      <div className="relative mx-auto max-w-5xl">
        <Link
          href="/jobs"
          className="text-sm text-zinc-400 transition hover:text-white"
        >
          ← Powrót do ofert
        </Link>

        <article className="mt-8 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60">
          <div className="border-b border-zinc-800 p-6 sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              DevJobs / Szczegóły oferty
            </p>

            <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
              {job.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-zinc-400 sm:text-base">
              {job.employer?.companyProfile?.slug ? (
              <Link
                href={`/firmy/${job.employer.companyProfile.slug}`}
                className="font-medium text-white transition hover:text-blue-400"
              >
                {job.company}
              </Link>
            ) : (
              <span className="font-medium text-white">{job.company}</span>
            )}
              <span className="text-zinc-600">·</span>
              <span>{job.location}</span>
            </div>

            <div className="mt-7 flex flex-wrap gap-2">
              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-medium text-blue-300">
                {categoryLabels[job.category] ?? "Inne"}
              </span>

              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-medium text-emerald-300">
                {employmentLabels[job.employmentType] ?? "Nie określono"}
              </span>

              <span className="rounded-full border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-300">
                {workModeLabels[job.workMode] ?? "Nie określono"}
              </span>
            </div>

            <div className="mt-7 rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
              <p className="text-xs font-medium text-zinc-500">
                Wynagrodzenie
              </p>

              {salary ? (
                <>
                  <p className="mt-2 text-2xl font-bold text-emerald-300">
                    {salary}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    Brutto / miesiąc
                  </p>
                </>
              ) : (
                <p className="mt-2 text-sm text-zinc-400">
                  Pracodawca nie podał wynagrodzenia.
                </p>
              )}
            </div>

            <p className="mt-7 text-xs text-zinc-500">
              Opublikowano: {job.createdAt.toLocaleDateString("pl-PL")}
            </p>
          </div>

          <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1fr_280px]">
            <section>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                  Poznaj stanowisko
                </p>

                <h2 className="mt-3 text-2xl font-bold">
                  Opis stanowiska
                </h2>
              </div>

              <p className="mt-6 whitespace-pre-wrap text-sm leading-8 text-zinc-300 sm:text-base">
                {job.description}
              </p>
            </section>

            <aside className="h-fit rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-xl">
                ✉️
              </div>

              <h2 className="mt-5 text-xl font-bold">
                Zainteresowany?
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Nie czekaj. Wyślij zgłoszenie i zrób kolejny krok w swojej karierze.
              </p>

              <form action={applyToJob} className="mt-6">
                <input type="hidden" name="jobId" value={job.id} />

                {error === "already-applied" && (
                  <p className="mb-4 rounded-lg border border-amber-800 bg-amber-950/50 p-3 text-sm leading-6 text-amber-300">
                    Już aplikowałeś na tę ofertę.
                  </p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-blue-600 text-white hover:bg-blue-500"
                >
                  Aplikuj na to stanowisko →
                </Button>
              </form>

              {isCandidate && (
                <form action={toggleSavedJob} className="mt-3">
                  <input type="hidden" name="jobId" value={job.id} />

                  <Button
                    type="submit"
                    variant="outline"
                    size="lg"
                    className="w-full border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-300"
                  >
                    {savedJob ? "♥ Usuń z zapisanych" : "♡ Zapisz ofertę"}
                  </Button>
                </form>
              )}

              <p className="mt-4 text-center text-xs leading-5 text-zinc-500">
                Twoje zgłoszenie zostanie przekazane pracodawcy.
              </p>
            </aside>
          </div>
        </article>

        <div className="mt-6 text-center">
          <Link
            href="/jobs"
            className="text-sm text-zinc-400 transition hover:text-blue-400"
          >
            ← Zobacz pozostałe oferty
          </Link>
        </div>
      </div>
    </main>
  );
}
