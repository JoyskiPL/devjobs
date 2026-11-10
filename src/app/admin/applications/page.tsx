
import Link from "next/link";
import { Prisma } from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import AdminApplicationsFilters from "./admin-applications-filters";

type AdminApplicationsPageProps = {
  searchParams: Promise<{
    search?: string | string[];
    status?: string | string[];
    sort?: string | string[];
  }>;
};

const validStatuses = ["PENDING", "ACCEPTED", "REJECTED"] as const;

function getValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

const statusLabels = {
  PENDING: "Oczekuje",
  ACCEPTED: "Zaakceptowane",
  REJECTED: "Odrzucone",
};

const statusColors = {
  PENDING: "border-yellow-700 bg-yellow-950 text-yellow-300",
  ACCEPTED: "border-emerald-700 bg-emerald-950 text-emerald-300",
  REJECTED: "border-red-700 bg-red-950 text-red-300",
};

export default async function AdminApplicationsPage({
  searchParams,
}: AdminApplicationsPageProps) {
  await requireAdmin();

  const params = await searchParams;

  const search = getValue(params.search).trim().slice(0, 100);
  const requestedStatus = getValue(params.status);
  const status = validStatuses.includes(
    requestedStatus as (typeof validStatuses)[number],
  )
    ? (requestedStatus as (typeof validStatuses)[number])
    : "";

  const sort = getValue(params.sort);

  const where: Prisma.ApplicationWhereInput = {
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            {
              candidate: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
            {
              candidate: {
                email: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
            {
              job: {
                title: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
            {
              job: {
                company: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          ],
        }
      : {}),
  };

  const [applications, totalApplications, filteredApplications, pendingCount, acceptedCount, rejectedCount] =
    await Promise.all([
      prisma.application.findMany({
        where,
        orderBy: {
          createdAt: sort === "oldest" ? "asc" : "desc",
        },
        include: {
          candidate: {
            select: {
              name: true,
              email: true,
            },
          },
          job: {
            select: {
              id: true,
              title: true,
              company: true,
              location: true,
              employer: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      }),
      prisma.application.count(),
      prisma.application.count({ where }),
      prisma.application.count({ where: { status: "PENDING" } }),
      prisma.application.count({ where: { status: "ACCEPTED" } }),
      prisma.application.count({ where: { status: "REJECTED" } }),
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

          <h1 className="text-3xl font-bold">Aplikacje</h1>

          <p className="mt-2 text-gray-400">
            Przeglądaj wszystkie zgłoszenia kandydatów w serwisie.
          </p>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-gray-400">Wszystkie aplikacje</p>
            <p className="mt-2 text-3xl font-bold">{totalApplications}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-gray-400">Oczekujące</p>
            <p className="mt-2 text-3xl font-bold text-yellow-400">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-gray-400">Zaakceptowane</p>
            <p className="mt-2 text-3xl font-bold text-emerald-400">
              {acceptedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-gray-400">Odrzucone</p>
            <p className="mt-2 text-3xl font-bold text-red-400">
              {rejectedCount}
            </p>
          </div>
        </div>

        <AdminApplicationsFilters
          initialSearch={search}
          initialStatus={status}
          initialSort={sort === "oldest" ? "oldest" : "newest"}
        />

        <p className="mb-4 text-sm text-gray-400">
          Znaleziono {filteredApplications} z {totalApplications} aplikacji
        </p>

        <div className="space-y-4">
          {applications.map((application) => (
            <article
              key={application.id}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">
                    {application.candidate.name ||
                      "Kandydat bez podanego imienia"}
                  </h2>

                  <p className="mt-1 text-sm text-gray-400">
                    {application.candidate.email || "Brak adresu e-mail"}
                  </p>
                </div>

                <span
                  className={`rounded-full border px-3 py-1 text-sm font-medium ${statusColors[application.status]}`}
                >
                  {statusLabels[application.status]}
                </span>
              </div>

              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Oferta pracy
                </p>

                <Link
                  href={`/jobs/${application.job.id}`}
                  className="mt-2 inline-block font-medium text-blue-400 transition hover:text-blue-300"
                >
                  {application.job.title}
                </Link>

                <p className="mt-1 text-sm text-gray-400">
                  {application.job.company} · {application.job.location}
                </p>

                <p className="mt-3 text-sm text-gray-400">
                  Pracodawca:{" "}
                  {application.job.employer?.name ||
                    application.job.employer?.email ||
                    "Brak danych"}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                <p className="text-xs text-gray-500">
                  Data aplikacji:{" "}
                  {application.createdAt.toLocaleDateString("pl-PL")}
                </p>

                <span className="text-xs text-gray-500">
                  ID aplikacji: #{application.id}
                </span>
              </div>
            </article>
          ))}

          {applications.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.04] p-10 text-center">
              <h2 className="text-lg font-semibold">
                Nie znaleziono aplikacji
              </h2>

              <p className="mt-2 text-sm text-gray-400">
                Spróbuj zmienić kryteria wyszukiwania lub wyczyścić filtry.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
