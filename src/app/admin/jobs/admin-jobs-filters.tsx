
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type AdminJobsFiltersProps = {
  initialSearch: string;
  initialCategory: string;
  initialEmployment: string;
  initialWorkMode: string;
  initialSort: string;
};

export default function AdminJobsFilters({
  initialSearch,
  initialCategory,
  initialEmployment,
  initialWorkMode,
  initialSort,
}: AdminJobsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [employment, setEmployment] = useState(initialEmployment);
  const [workMode, setWorkMode] = useState(initialWorkMode);
  const [sort, setSort] = useState(initialSort);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (search.trim()) {
        params.set("search", search.trim());
      } else {
        params.delete("search");
      }

      if (category) {
        params.set("category", category);
      } else {
        params.delete("category");
      }

      if (employment) {
        params.set("employment", employment);
      } else {
        params.delete("employment");
      }

      if (workMode) {
        params.set("workMode", workMode);
      } else {
        params.delete("workMode");
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
  }, [
    search,
    category,
    employment,
    workMode,
    sort,
    pathname,
    router,
    searchParams,
  ]);

  function clearFilters() {
    setSearch("");
    setCategory("");
    setEmployment("");
    setWorkMode("");
    setSort("newest");
  }

  return (
    <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <label
            htmlFor="search"
            className="mb-2 block text-sm text-gray-400"
          >
            Wyszukaj ofertę
          </label>

          <input
            id="search"
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Stanowisko, firma lub lokalizacja..."
            className="w-full rounded-xl border border-white/10 bg-[#0a0f1c] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="mb-2 block text-sm text-gray-400"
          >
            Kategoria
          </label>

          <select
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#0a0f1c] px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
          >
            <option value="">Wszystkie kategorie</option>
            <option value="IT">IT</option>
            <option value="FINANCE">Finanse</option>
            <option value="MARKETING">Marketing</option>
            <option value="LOGISTICS">Logistyka</option>
            <option value="ADMINISTRATION">Administracja</option>
            <option value="ENGINEERING">Inżynieria</option>
            <option value="OTHER">Inne</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="employment"
            className="mb-2 block text-sm text-gray-400"
          >
            Rodzaj zatrudnienia
          </label>

          <select
            id="employment"
            value={employment}
            onChange={(event) => setEmployment(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#0a0f1c] px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
          >
            <option value="">Wszystkie rodzaje</option>
            <option value="FULL_TIME">Pełny etat</option>
            <option value="PART_TIME">Część etatu</option>
            <option value="CONTRACT">Kontrakt</option>
            <option value="MANDATE">Umowa zlecenie</option>
            <option value="INTERNSHIP">Staż</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="workMode"
            className="mb-2 block text-sm text-gray-400"
          >
            Tryb pracy
          </label>

          <select
            id="workMode"
            value={workMode}
            onChange={(event) => setWorkMode(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#0a0f1c] px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
          >
            <option value="">Wszystkie tryby</option>
            <option value="REMOTE">Zdalna</option>
            <option value="HYBRID">Hybrydowa</option>
            <option value="OFFICE">Stacjonarna</option>
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
            <option value="newest">Najnowsze oferty</option>
            <option value="oldest">Najstarsze oferty</option>
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
