"use client";

import { toggleJobVisibility } from "./jobs/[id]/edit/actions";

export default function ToggleJobButton({
  id,
  isActive,
}: {
  id: number;
  isActive: boolean;
}) {
  return (
    <form
      action={toggleJobVisibility}
      onSubmit={(event) => {
        const message = isActive
          ? "Czy na pewno chcesz ukryć tę ofertę?"
          : "Czy na pewno chcesz przywrócić tę ofertę?";

        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />

      <button
        type="submit"
        className={`rounded-md px-4 py-2 text-sm font-medium transition ${
          isActive
            ? "border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
            : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
        }`}
      >
        {isActive ? "Ukryj ofertę" : "Przywróć ofertę"}
      </button>
    </form>
  );
}