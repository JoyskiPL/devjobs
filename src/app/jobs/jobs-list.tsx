
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

type JobItem = {
  id: number;
  slug: string | null;
  title: string;
  company: string;
  location: string;
  description: string;
  category: string;
  employmentType: string;
  workMode: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string | null;
  createdAt: string;
};

type JobsFilters = {
  search: string;
  location: string;
  category: string;
  employment: string;
  workMode: string;
  minSalary: string;
  currency: string;
  sort: string;
};

type JobsListProps = {
  jobs: JobItem[];
  totalJobs: number;
  totalFilteredJobs: number;
  page: number;
  totalPages: number;
  filters: JobsFilters;
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

const selectClass =
  "h-11 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

function formatSalary(job: JobItem) {
  if (
    job.salaryMin === null ||
    job.salaryMax === null ||
    !job.salaryCurrency
  ) {
    return null;
  }

  const formatter = new Intl.NumberFormat("pl-PL", {
    maximumFractionDigits: 0,
  });

  const min = formatter.format(job.salaryMin);
  const max = formatter.format(job.salaryMax);

  return `${min}–${max} ${job.salaryCurrency}`;
}

function getPageHref(filters: JobsFilters, page: number) {
  const params = new URLSearchParams();

  if (filters.search) params.set("q", filters.search);
  if (filters.location) params.set("location", filters.location);
  if (filters.category !== "ALL") {
    params.set("category", filters.category);
  }
  if (filters.employment !== "ALL") {
    params.set("employment", filters.employment);
  }
  if (filters.workMode !== "ALL") {
    params.set("workMode", filters.workMode);
  }
  if (filters.minSalary) {
    params.set("minSalary", filters.minSalary);
    params.set("currency", filters.currency);
  }
  if (filters.sort !== "newest") {
    params.set("sort", filters.sort);
  }

  params.set("page", page.toString());

  return `/jobs?${params.toString()}`;
}

export default function JobsList({
  jobs,
  totalJobs,
  totalFilteredJobs,
  page,
  totalPages,
  filters,
}: JobsListProps) {
  const hasActiveFilters =
    filters.search !== "" ||
    filters.location !== "" ||
    filters.category !== "ALL" ||
    filters.employment !== "ALL" ||
    filters.workMode !== "ALL" ||
    filters.minSalary !== "" ||
    filters.sort !== "newest";

  return (
    <>
      <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6">
        <div>
          <h2 className="text-lg font-semibold">Znajdź swoją ofertę</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Wyszukuj stanowiska i dopasuj wyniki do swoich oczekiwań.
          </p>
        </div>

        <form action="/jobs" method="GET">
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label
                htmlFor="job-search"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Stanowisko, firma lub opis
              </label>

              <input
                id="job-search"
                name="q"
                type="search"
                defaultValue={filters.search}
                placeholder="Np. Frontend Developer, Google, React..."
                className={selectClass}
              />
            </div>

            <div>
              <label
                htmlFor="job-location"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Lokalizacja
              </label>

              <input
                id="job-location"
                name="location"
                type="text"
                defaultValue={filters.location}
                placeholder="Np. Warszawa, Kraków, zdalnie..."
                className={selectClass}
              />
            </div>

            <div>
              <label
                htmlFor="job-category"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Kategoria
              </label>

              <select
                id="job-category"
                name="category"
                defaultValue={filters.category}
                className={selectClass}
              >
                <option value="ALL">Wszystkie kategorie</option>
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="job-employment"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Rodzaj zatrudnienia
              </label>

              <select
                id="job-employment"
                name="employment"
                defaultValue={filters.employment}
                className={selectClass}
              >
                <option value="ALL">Wszystkie rodzaje</option>
                {Object.entries(employmentLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="job-work-mode"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Tryb pracy
              </label>

              <select
                id="job-work-mode"
                name="workMode"
                defaultValue={filters.workMode}
                className={selectClass}
              >
                <option value="ALL">Wszystkie tryby</option>
                {Object.entries(workModeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="job-min-salary"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Minimalne wynagrodzenie brutto / miesiąc
              </label>

              <div className="flex gap-2">
                <input
                  id="job-min-salary"
                  name="minSalary"
                  type="number"
                  min="1"
                  step="1"
                  defaultValue={filters.minSalary}
                  placeholder="Np. 8000"
                  className={selectClass}
                />

                <select
                  name="currency"
                  aria-label="Waluta wynagrodzenia"
                  defaultValue={filters.currency}
                  className={`${selectClass} max-w-28`}
                >
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="job-sort"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Sortowanie
              </label>

              <select
                id="job-sort"
                name="sort"
                defaultValue={filters.sort}
                className={selectClass}
              >
                <option value="newest">Najnowsze</option>
                <option value="salary">Najwyższe wynagrodzenie</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 pt-5">
            <p className="text-sm text-zinc-400">
              Znaleziono{" "}
              <span className="font-semibold text-white">
                {totalFilteredJobs}
              </span>{" "}
              z {totalJobs} ofert
            </p>

            <div className="flex flex-wrap gap-3">
              {hasActiveFilters && (
                <Button
                  asChild
                  type="button"
                  variant="outline"
                  className="border-zinc-700 text-zinc-300"
                >
                  <Link href="/jobs">Wyczyść filtry</Link>
                </Button>
              )}

              <Button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-500"
              >
                Szukaj ofert
              </Button>
            </div>
          </div>
        </form>
      </section>

      {jobs.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 px-6 py-14 text-center">
          <div className="text-3xl">🔎</div>

          <h2 className="mt-4 text-lg font-semibold">
            {totalJobs === 0
              ? "Na razie nie ma żadnych ofert"
              : "Nie znaleziono ofert"}
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            Spróbuj zmienić wyszukiwaną frazę lub wybrane filtry.
          </p>

          {hasActiveFilters && (
            <Button
              asChild
              variant="outline"
              className="mt-6"
            >
              <Link href="/jobs">Wyczyść filtry</Link>
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {jobs.map((job) => {
              const salary = formatSalary(job);

              return (
                <article
                  key={job.id}
                  className="group flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:bg-zinc-900"
                >
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
                        {categoryLabels[job.category] ?? "Inne"}
                      </span>

                      <span className="text-xs text-zinc-500">
                        {new Date(job.createdAt).toLocaleDateString("pl-PL")}
                      </span>
                    </div>

                    <h2 className="mt-5 text-xl font-bold tracking-tight transition group-hover:text-blue-300">
                      {job.title}
                    </h2>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-zinc-400">
                      <span>{job.company}</span>
                      <span className="text-zinc-600">·</span>
                      <span>{job.location}</span>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
                        {employmentLabels[job.employmentType] ?? "Nie określono"}
                      </span>

                      <span className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300">
                        {workModeLabels[job.workMode] ?? "Nie określono"}
                      </span>
                    </div>

                    <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
                      <p className="text-xs font-medium text-zinc-500">
                        Wynagrodzenie
                      </p>

                      {salary ? (
                        <>
                          <p className="mt-1 text-lg font-bold text-emerald-300">
                            {salary}
                          </p>
                          <p className="mt-1 text-xs text-zinc-500">
                            Brutto / miesiąc
                          </p>
                        </>
                      ) : (
                        <p className="mt-1 text-sm text-zinc-400">
                          Nie zostało podane
                        </p>
                      )}
                    </div>

                    <p className="mt-5 line-clamp-3 text-sm leading-7 text-zinc-400">
                      {job.description}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-zinc-800 pt-5">
                    <Button
                      asChild
                      className="w-full bg-blue-600 text-white hover:bg-blue-500"
                    >
                      <Link href={`/jobs/${job.slug ?? job.id}`}>
                        Zobacz ofertę →
                      </Link>
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>

                    {totalPages > 1 && (
            <nav
                aria-label="Paginacja ofert"
                className="mt-10 flex flex-wrap items-center justify-center gap-2"
            >
                <Button
                asChild
                variant="outline"
                size="icon"
                disabled={page <= 1}
                className="size-10 rounded-full border-zinc-700 text-zinc-300 hover:border-blue-500 hover:text-blue-400"
                >
                <Link
                    href={getPageHref(filters, Math.max(1, page - 1))}
                    aria-label="Poprzednia strona"
                    aria-disabled={page <= 1}
                    tabIndex={page <= 1 ? -1 : undefined}
                    className={page <= 1 ? "pointer-events-none opacity-40" : ""}
                >
                    ←
                </Link>
                </Button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                    <Button
                    key={pageNumber}
                    asChild
                    variant={page === pageNumber ? "default" : "outline"}
                    size="icon"
                    className={`size-10 rounded-full ${
                        page === pageNumber
                        ? "bg-blue-600 text-white hover:bg-blue-500"
                        : "border-zinc-700 text-zinc-300 hover:border-blue-500 hover:text-blue-400"
                    }`}
                    >
                    <Link
                        href={getPageHref(filters, pageNumber)}
                        aria-current={page === pageNumber ? "page" : undefined}
                    >
                        {pageNumber}
                    </Link>
                    </Button>
                ),
                )}

                <Button
                asChild
                variant="outline"
                size="icon"
                disabled={page >= totalPages}
                className="size-10 rounded-full border-zinc-700 text-zinc-300 hover:border-blue-500 hover:text-blue-400"
                >
                <Link
                    href={getPageHref(filters, Math.min(totalPages, page + 1))}
                    aria-label="Następna strona"
                    aria-disabled={page >= totalPages}
                    tabIndex={page >= totalPages ? -1 : undefined}
                    className={page >= totalPages ? "pointer-events-none opacity-40" : ""}
                >
                    →
                </Link>
                </Button>
            </nav>
            )}
        </>
      )}
    </>
  );
}
