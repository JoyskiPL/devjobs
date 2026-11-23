
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type CompanyPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CompanyPage({
  params,
}: CompanyPageProps) {
  const { slug } = await params;

  const company = await prisma.company.findUnique({
    where: {
      slug,
    },
    include: {
      owner: {
        include: {
          employerJobs: {
            where: {
              isActive: true,
              moderationStatus: "APPROVED",
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      },
    },
  });

  if (!company) {
    notFound();
  }

  const jobs = company.owner.employerJobs;

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

        <section className="mt-8 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60">
          <div className="border-b border-zinc-800 p-6 sm:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              {company.logoUrl ? (
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-950">
                  <Image
                    src={company.logoUrl}
                    alt={`Logo firmy ${company.name}`}
                    fill
                    unoptimized
                    className="object-contain p-2"
                    sizes="96px"
                  />
                </div>
              ) : (
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-3xl font-bold text-blue-400">
                  {company.name.charAt(0).toUpperCase()}
                </div>
              )}

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
                  DevJobs / Profil firmy
                </p>

                <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
                  {company.name}
                </h1>

                {company.location && (
                  <p className="mt-3 text-sm text-zinc-400">
                    📍 {company.location}
                  </p>
                )}
              </div>
            </div>

            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block text-sm font-medium text-blue-400 transition hover:text-blue-300"
              >
                Odwiedź stronę internetową →
              </a>
            )}
          </div>

          <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1fr_280px]">
            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                Poznaj nas
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                O firmie
              </h2>

              <p className="mt-6 whitespace-pre-wrap text-sm leading-8 text-zinc-300 sm:text-base">
                {company.description || "Firma nie dodała jeszcze opisu."}
              </p>
            </section>

            <aside className="h-fit rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                Informacje
              </p>

              <h2 className="mt-4 text-xl font-bold">
                {company.name}
              </h2>

              <div className="mt-5 space-y-4 text-sm">
                {company.location && (
                  <div>
                    <p className="text-zinc-500">Lokalizacja</p>
                    <p className="mt-1 text-zinc-200">
                      {company.location}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-zinc-500">Aktywne oferty</p>
                  <p className="mt-1 text-zinc-200">
                    {jobs.length}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
                Kariera
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                Oferty pracy
              </h2>
            </div>

            <p className="text-sm text-zinc-400">
              {jobs.length} aktywnych ofert
            </p>
          </div>

          {jobs.length > 0 ? (
            <div className="mt-6 grid gap-4">
              {jobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.slug ?? job.id}`}
                  className="group rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 transition hover:border-blue-500/40 hover:bg-zinc-900"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="text-lg font-bold transition group-hover:text-blue-400">
                        {job.title}
                      </h3>

                      <p className="mt-2 text-sm text-zinc-400">
                        {job.location}
                      </p>
                    </div>

                    <span className="text-sm font-medium text-blue-400">
                      Zobacz ofertę →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/60 p-8 text-center">
              <h3 className="text-lg font-semibold">
                Brak aktywnych ofert
              </h3>

              <p className="mt-2 text-sm text-zinc-400">
                Ta firma nie publikuje obecnie żadnych ofert pracy.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
