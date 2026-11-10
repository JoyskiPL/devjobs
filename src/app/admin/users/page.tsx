
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import AdminUsersFilters from "./admin-users-filters";

type AdminUsersPageProps = {
  searchParams: Promise<{
    search?: string;
    role?: string;
    sort?: string;
  }>;
};

const validRoles = ["CANDIDATE", "EMPLOYER", "ADMIN"] as const;

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  await requireAdmin();

  const params = await searchParams;

  const search = params.search?.trim().slice(0, 100) || "";

  const role = validRoles.includes(
    params.role as (typeof validRoles)[number],
  )
    ? (params.role as (typeof validRoles)[number])
    : "";

  const sort = params.sort === "oldest" ? "asc" : "desc";

  const where = {
    ...(search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              email: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
    ...(role ? { role } : {}),
  };

  const [users, totalUsers, filteredUsers] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: {
        createdAt: sort,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            employerJobs: true,
            applications: true,
          },
        },
      },
    }),
    prisma.user.count(),
    prisma.user.count({ where }),
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

          <h1 className="text-3xl font-bold">Użytkownicy</h1>

          <p className="mt-2 text-gray-400">
            Wszystkie konta zarejestrowane w serwisie.
          </p>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-gray-400">
              Łączna liczba użytkowników
            </p>
            <p className="mt-2 text-3xl font-bold">{totalUsers}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-gray-400">
              Znaleziono użytkowników
            </p>
            <p className="mt-2 text-3xl font-bold">{filteredUsers}</p>
          </div>
        </div>

        <AdminUsersFilters
          initialSearch={search}
          initialRole={role}
          initialSort={params.sort === "oldest" ? "oldest" : "newest"}
        />

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.04]">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[0.03] text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">Użytkownik</th>
                <th className="px-6 py-4 font-medium">Rola</th>
                <th className="px-6 py-4 font-medium">Oferty</th>
                <th className="px-6 py-4 font-medium">Aplikacje</th>
                <th className="px-6 py-4 font-medium">Data rejestracji</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium">
                      {user.name || "Brak nazwy"}
                    </p>
                    <p className="mt-1 text-gray-400">
                      {user.email || "Brak adresu e-mail"}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        user.role === "ADMIN"
                          ? "bg-purple-500/15 text-purple-400"
                          : user.role === "EMPLOYER"
                            ? "bg-blue-500/15 text-blue-400"
                            : "bg-gray-500/15 text-gray-300"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4">{user._count.employerJobs}</td>

                  <td className="px-6 py-4">{user._count.applications}</td>

                  <td className="px-6 py-4 text-gray-400">
                    {user.createdAt.toLocaleDateString("pl-PL")}
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-gray-400"
                  >
                    Nie znaleziono użytkowników spełniających kryteria.
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
