
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import JobsList from "./jobs-list";

type JobsPageProps = {
  searchParams: Promise<{
    q?: string | string[];
    location?: string | string[];
    category?: string | string[];
    employment?: string | string[];
    workMode?: string | string[];
    minSalary?: string | string[];
    currency?: string | string[];
    sort?: string | string[];
    page?: string | string[];
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

const currencies = [
  "PLN",
  "EUR",
  "USD",
  "GBP",
  "CHF",
  "CZK",
  "SEK",
  "NOK",
  "DKK",
];

const pageSize = 10;

function getValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams;

  const search = getValue(params.q).trim();
  const location = getValue(params.location).trim();
  const category = getValue(params.category);
  const employment = getValue(params.employment);
  const workMode = getValue(params.workMode);
  const currency = getValue(params.currency);
  const sort = getValue(params.sort);

  const salaryValue = Number(getValue(params.minSalary));
  const minSalary =
    Number.isSafeInteger(salaryValue) && salaryValue > 0
      ? salaryValue
      : null;

  const requestedPage = Number(getValue(params.page));
  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const where: Prisma.JobWhereInput = {
    isActive: true,
  };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { company: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (location) {
    where.location = {
      contains: location,
      mode: "insensitive",
    };
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

  if (minSalary !== null && currencies.includes(currency)) {
    where.salaryMax = {
      gte: minSalary,
    };
    where.salaryCurrency = currency;
  }

  const [totalJobs, totalFilteredJobs] = await Promise.all([
    prisma.job.count(),
    prisma.job.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalFilteredJobs / pageSize));
  const currentPage = Math.min(page, totalPages);

  const orderBy: Prisma.JobOrderByWithRelationInput[] =
    sort === "salary"
      ? [
          { salaryMax: { sort: "desc", nulls: "last" } },
          { createdAt: "desc" },
        ]
      : [{ createdAt: "desc" }];

  const jobs = await prisma.job.findMany({
    where,
    orderBy,
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  const serializedJobs = jobs.map((job) => ({
    ...job,
    createdAt: job.createdAt.toISOString(),
  }));

  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 px-4 py-12 text-white sm:px-6">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl">
        <Link
          href="/"
          className="text-sm text-zinc-400 transition hover:text-white"
        >
          ← Strona główna
        </Link>

        <div className="mt-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            DevJobs / Kariera
          </p>

          <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Znajdź swoją kolejną pracę.
              </h1>

              <p className="mt-4 max-w-2xl leading-7 text-zinc-400">
                Przeglądaj aktualne oferty i znajdź stanowisko,
                które odpowiada Twoim umiejętnościom oraz oczekiwaniom.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 px-5 py-3">
              <p className="text-xs text-zinc-500">Wszystkie oferty</p>
              <p className="mt-1 text-2xl font-bold">{totalFilteredJobs}</p>
            </div>
          </div>
        </div>

        <JobsList
          jobs={serializedJobs}
          totalJobs={totalJobs}
          totalFilteredJobs={totalFilteredJobs}
          page={currentPage}
          totalPages={totalPages}
          filters={{
            search,
            location,
            category,
            employment,
            workMode,
            minSalary: minSalary?.toString() ?? "",
            currency: currencies.includes(currency) ? currency : "PLN",
            sort: sort === "salary" ? "salary" : "newest",
          }}
        />
      </div>
    </main>
  );
}
