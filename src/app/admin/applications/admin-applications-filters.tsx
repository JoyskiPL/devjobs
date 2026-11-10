
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type AdminApplicationsFiltersProps = {
  initialSearch: string;
  initialStatus: string;
  initialSort: string;
};

export default function AdminApplicationsFilters({
  initialSearch,
  initialStatus,
  initialSort,
}: AdminApplicationsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState(initialStatus);
  const [sort, setSort] = useState(initialSort);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (search.trim()) {
        params.set("search", search.trim());
      } else {
        params.delete("search");
      }

      if (status) {
        params.set("status", status);
      } else {
        params.delete("status");
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
  }, [search, status, sort, pathname, router, searchParams]);

  function clearFilters() {
    setSearch("");
    setStatus("");
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
            Wyszukaj aplikację
          </label>

          <input
            id="search"
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Kandydat, e-mail, stanowisko lub firma..."
            className="w-full rounded-xl border border-white/10 bg-[#0a0f1c] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="status"
            className="mb-2 block text-sm text-gray-400"
          >
            Status aplikacji
          </label>

          <select
            id="status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#0a0f1c] px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
          >
            <option value="">Wszystkie statusy</option>
            <option value="PENDING">Oczekujące</option>
            <option value="ACCEPTED">Zaakceptowane</option>
            <option value="REJECTED">Odrzucone</option>
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
            <option value="newest">Najnowsze aplikacje</option>
            <option value="oldest">Najstarsze aplikacje</option>
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
