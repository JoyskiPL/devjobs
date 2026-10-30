import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { createJob } from "./actions";

export default async function NewJobPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "EMPLOYER") {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold">Dodaj ofertę pracy</h1>

        <p className="mt-3 text-zinc-400">
          Uzupełnij informacje o stanowisku, które chcesz opublikować.
        </p>

        <form action={createJob} className="mt-8 space-y-5">
          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-medium">
              Nazwa stanowiska
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="np. Junior Data Analyst"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="company" className="mb-2 block text-sm font-medium">
              Nazwa firmy
            </label>
            <input
              id="company"
              name="company"
              type="text"
              required
              placeholder="np. DevJobs Demo"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="location" className="mb-2 block text-sm font-medium">
              Lokalizacja
            </label>
            <input
              id="location"
              name="location"
              type="text"
              required
              placeholder="np. Warszawa / Praca zdalna"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium"
            >
              Opis stanowiska
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={6}
              placeholder="Opisz obowiązki, wymagania i oferowane warunki..."
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500"
            >
              Zapisz ofertę
            </button>

            <a
              href="/employer"
              className="rounded-lg border border-zinc-700 px-5 py-3 hover:bg-zinc-900"
            >
              Anuluj
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}