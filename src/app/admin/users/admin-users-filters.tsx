
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type AdminUsersFiltersProps = {
  initialSearch: string;
  initialRole: string;
  initialSort: string;
};

export default function AdminUsersFilters({
  initialSearch,
  initialRole,
  initialSort,
}: AdminUsersFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialSearch);
  const [role, setRole] = useState(initialRole);
  const [sort, setSort] = useState(initialSort);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (search.trim()) {
        params.set("search", search.trim());
      } else {
        params.delete("search");
      }

      if (role) {
        params.set("role", role);
      } else {
        params.delete("role");
      }

      if (sort !== "newest") {
        params.set("sort", sort);
      } else {
        params.delete("sort");
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, role, sort, pathname, router, searchParams]);

  function clearFilters() {
    setSearch("");
    setRole("");
    setSort("newest");
  }

  return (
    <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label
            htmlFor="search"
            className="mb-2 block text-sm text-gray-400"
          >
            Wyszukaj użytkownika
          </label>
          <input
            id="search"
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Imię, nazwisko lub e-mail..."
            className="w-full rounded-xl border border-white/10 bg-[#0a0f1c] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="role"
            className="mb-2 block text-sm text-gray-400"
          >
            Rola użytkownika
          </label>
          <select
            id="role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#0a0f1c] px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
          >
            <option value="">Wszystkie role</option>
            <option value="CANDIDATE">Kandydat</option>
            <option value="EMPLOYER">Pracodawca</option>
            <option value="ADMIN">Administrator</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="sort"
            className="mb-2 block text-sm text-gray-400"
          >
            Sortowanie
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#0a0f1c] px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
          >
            <option value="newest">Najnowsi użytkownicy</option>
            <option value="oldest">Najstarsi użytkownicy</option>
          </select>
        </div>
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={clearFilters}
          className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-gray-300 transition hover:bg-white/[0.05]"
        >
          Wyczyść filtry
        </button>
      </div>
    </div>
  );
}
