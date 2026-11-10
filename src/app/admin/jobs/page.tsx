
import Link from "next/link";
import { Prisma } from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import AdminJobsFilters from "./admin-jobs-filters";
import {toggleJobVisibility, approveJob, rejectJob,} from "./actions";

type AdminJobsPageProps = {
  searchParams: Promise<{
    search?: string | string[];
    category?: string | string[];
    employment?: string | string[];
    workMode?: string | string[];
    sort?: string | string[];
  }>;
};

const categories = [
  "IT",
  "FINANCE",
  "MARKETING",
  "LOGISTICS",
  "ADMINISTRATION",
  "ENGINEERING",
  "OTHER",
];

const employmentTypes = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "MANDATE",
  "INTERNSHIP",
];

const workModes = ["REMOTE", "HYBRID", "OFFICE"];

function getValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function AdminJobsPage({
  searchParams,
}: AdminJobsPageProps) {
  await requireAdmin();

  const params = await searchParams;

  const search = getValue(params.search).trim().slice(0, 100);
  const category = getValue(params.category);
  const employment = getValue(params.employment);
  const workMode = getValue(params.workMode);
  const sort = getValue(params.sort);

  const where: Prisma.JobWhereInput = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { company: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
    ];
  }

  if (categories.includes(category)) {
    where.category = category as Prisma.JobWhereInput["category"];
  }

  if (employmentTypes.includes(employment)) {
    where.employmentType =
      employment as Prisma.JobWhereInput["employmentType"];
  }

  if (workModes.includes(workMode)) {
    where.workMode = workMode as Prisma.JobWhereInput["workMode"];
  }

  const [jobs, totalJobs, filteredJobs, activeJobs, hiddenJobs] =
    await Promise.all([
      prisma.job.findMany({
        where,
        orderBy: {
          createdAt: sort === "oldest" ? "asc" : "desc",
        },
        select: {
          id: true,
          title: true,
          company: true,
          location: true,
          category: true,
          employmentType: true,
          workMode: true,
          createdAt: true,
          salaryMin: true,
          salaryMax: true,
          salaryCurrency: true,
          isActive: true,
          moderationStatus: true,
          moderationReason: true,
          employer: {
            select: {
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              applications: true,
            },
          },
        },
      }),
      prisma.job.count(),
      prisma.job.count({ where }),
      prisma.job.count({ where: { isActive: true } }),
      prisma.job.count({ where: { isActive: false } }),
    ]);

  return (
    <main className="min-h-screen bg-[#0a0f1c] px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="mb-8 inline-flex text-sm text-blue-400 transition hover:text-blue-300"
        >
          ← Powrót do panelu
        </Link>

        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-blue-400">
            DEVJOBS ADMINISTRATION
          </p>

          <h1 className="text-3xl font-bold">Oferty pracy</h1>

          <p className="mt-2 text-gray-400">
            Przeglądaj wszystkie oferty i zarządzaj ich widocznością.
          </p>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-gray-400">Łączna liczba ofert</p>
            <p className="mt-2 text-3xl font-bold">{totalJobs}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-gray-400">Znalezione oferty</p>
            <p className="mt-2 text-3xl font-bold">{filteredJobs}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-gray-400">Aktywne oferty</p>
            <p className="mt-2 text-3xl font-bold text-emerald-400">
              {activeJobs}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-gray-400">Ukryte oferty</p>
            <p className="mt-2 text-3xl font-bold text-red-400">
              {hiddenJobs}
            </p>
          </div>
        </div>

        <AdminJobsFilters
          initialSearch={search}
          initialCategory={categories.includes(category) ? category : ""}
          initialEmployment={
            employmentTypes.includes(employment) ? employment : ""
          }
          initialWorkMode={workModes.includes(workMode) ? workMode : ""}
          initialSort={sort === "oldest" ? "oldest" : "newest"}
        />

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.04]">
          <table className="w-full min-w-[1250px] text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[0.03] text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">Oferta</th>
                <th className="px-6 py-4 font-medium">Kategoria</th>
                <th className="px-6 py-4 font-medium">Zatrudnienie</th>
                <th className="px-6 py-4 font-medium">Tryb pracy</th>
                <th className="px-6 py-4 font-medium">Wynagrodzenie</th>
                <th className="px-6 py-4 font-medium">Aplikacje</th>
                <th className="px-6 py-4 font-medium">Widoczność</th>
                <th className="px-6 py-4 font-medium">Moderacja</th>
                <th className="px-6 py-4 font-medium">Data dodania</th>
                <th className="px-6 py-4 font-medium">Akcje</th>
              </tr>
            </thead>

            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium">{job.title}</p>
                    <p className="mt-1 text-gray-400">{job.company}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {job.location}
                    </p>
                    <p className="mt-2 text-xs text-gray-500">
                      Pracodawca:{" "}
                      {job.employer?.name ||
                        job.employer?.email ||
                        "Brak danych"}
                    </p>
                  </td>

                  <td className="px-6 py-4">{job.category}</td>

                  <td className="px-6 py-4">
                    {{
                      FULL_TIME: "Pełny etat",
                      PART_TIME: "Niepełny etat",
                      CONTRACT: "Kontrakt",
                      MANDATE: "Umowa zlecenie",
                      INTERNSHIP: "Staż",
                    }[job.employmentType]}
                  </td>

                  <td className="px-6 py-4">
                    {{
                      REMOTE: "Zdalna",
                      HYBRID: "Hybrydowa",
                      OFFICE: "Stacjonarna",
                    }[job.workMode]}
                  </td>

                  <td className="px-6 py-4">
                    {job.salaryMin !== null || job.salaryMax !== null
                      ? `${job.salaryMin?.toLocaleString("pl-PL") ?? "—"} – ${job.salaryMax?.toLocaleString("pl-PL") ?? "—"} ${job.salaryCurrency ?? ""}`
                      : "Nie podano"}
                  </td>

                  <td className="px-6 py-4">{job._count.applications}</td>

                  <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      job.isActive
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-red-500/15 text-red-400"
                    }`}
                  >
                    {job.isActive ? "Aktywna" : "Ukryta"}
                  </span>
                </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                          job.moderationStatus === "APPROVED"
                            ? "bg-emerald-500/15 text-emerald-400"
                            : job.moderationStatus === "PENDING"
                              ? "bg-amber-500/15 text-amber-400"
                              : "bg-red-500/15 text-red-400"
                        }`}
                      >
                        {{
                          APPROVED: "Zaakceptowana",
                          PENDING: "Oczekuje",
                          REJECTED: "Odrzucona",
                        }[job.moderationStatus]}
                      </span>

                      {job.moderationReason && (
                        <span className="max-w-48 text-xs text-gray-500">
                          Powód: {job.moderationReason}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-400">
                    {job.createdAt.toLocaleDateString("pl-PL")}
                  </td>

                 <td className="px-6 py-4">
                {job.moderationStatus === "PENDING" ? (
                  <div className="flex min-w-[180px] flex-col gap-2">
                    <form action={approveJob}>
                      <input
                        type="hidden"
                        name="jobId"
                        value={job.id}
                      />

                      <button
                        type="submit"
                        className="w-full whitespace-nowrap rounded-lg border border-emerald-500/30 px-3 py-2 text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/10"
                      >
                        Akceptuj
                      </button>
                    </form>

                    <form action={rejectJob} className="flex flex-col gap-2">
                      <input
                        type="hidden"
                        name="jobId"
                        value={job.id}
                      />

                      <input
                        type="text"
                        name="reason"
                        required
                        maxLength={2000}
                        placeholder="Powód odrzucenia"
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none placeholder:text-gray-500 focus:border-red-500/50"
                      />

                      <button
                        type="submit"
                        className="w-full whitespace-nowrap rounded-lg border border-red-500/30 px-3 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/10"
                      >
                        Odrzuć
                      </button>
                    </form>
                  </div>
                ) : job.moderationStatus === "APPROVED" ? (
                  <form action={toggleJobVisibility}>
                    <input
                      type="hidden"
                      name="jobId"
                      value={job.id}
                    />

                    <button
                      type="submit"
                      className={`whitespace-nowrap rounded-lg border px-3 py-2 text-xs font-medium transition ${
                        job.isActive
                          ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                          : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                      }`}
                    >
                      {job.isActive ? "Ukryj ofertę" : "Przywróć ofertę"}
                    </button>
                  </form>
                ) : (
                  <span className="text-xs text-red-400">
                    Oferta odrzucona
                  </span>
                )}
              </td>
                </tr>
              ))}

              {jobs.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
                    className="px-6 py-10 text-center text-gray-400"
                  >
                    Nie znaleziono ofert spełniających kryteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
