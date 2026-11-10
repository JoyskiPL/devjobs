"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function ApplicationsDateFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";

  function updateFilter(name: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    router.push(`?${params.toString()}`);
  }

  function clearFilters() {
    router.push(window.location.pathname);
  }

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="space-y-2">
        <label htmlFor="date-from" className="text-sm text-zinc-400">
          Data od
        </label>
        <input
          id="date-from"
          type="date"
          value={from}
          onChange={(event) => updateFilter("from", event.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="date-to" className="text-sm text-zinc-400">
          Data do
        </label>
        <input
          id="date-to"
          type="date"
          value={to}
          min={from || undefined}
          onChange={(event) => updateFilter("to", event.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
      </div>

      {(from || to) && (
        <button
          type="button"
          onClick={clearFilters}
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800"
        >
          Wyczyść daty
        </button>
      )}
    </div>
  );
}