"use client";

import { deleteJob } from "./actions";

export default function DeleteJobButton({ id }: { id: number }) {
  return (
    <form
      action={deleteJob}
      onSubmit={(event) => {
        if (
          !window.confirm(
            "Czy na pewno chcesz trwale usunąć tę ofertę? Można usunąć tylko oferty bez zgłoszeń."
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />

      <button
        type="submit"
        className="rounded-lg bg-red-600 px-5 py-3 font-medium hover:bg-red-500"
      >
        Usuń ofertę
      </button>
    </form>
  );
}