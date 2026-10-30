
"use client";

import { useActionState } from "react";
import { updateApplicationStatus } from "./actions";

type Status = "PENDING" | "ACCEPTED" | "REJECTED";

type Props = {
  applicationId: number;
  jobId: number;
  status: Status;
};

export default function StatusForm({
  applicationId,
  jobId,
  status,
}: Props) {
  const updateStatus = updateApplicationStatus.bind(
    null,
    applicationId,
    jobId
  );

  const [state, formAction, pending] = useActionState(
    updateStatus,
    null
  );

  return (
    <form
      action={formAction}
      className="flex flex-wrap items-center gap-2"
    >
      <select
        name="status"
        defaultValue={status}
        disabled={pending}
        className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white disabled:opacity-50"
      >
        <option value="PENDING">Oczekuje</option>
        <option value="ACCEPTED">Zaakceptowane</option>
        <option value="REJECTED">Odrzucone</option>
      </select>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Zapisywanie..." : "Zapisz status"}
      </button>

      {state?.error && (
        <p className="w-full text-sm text-red-400">
          {state.error}
        </p>
      )}
    </form>
  );
}
