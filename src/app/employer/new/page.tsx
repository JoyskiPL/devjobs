
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { createJob } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
        <div className="mb-8">
          <Link
            href="/employer"
            className="text-sm text-zinc-400 transition hover:text-white"
          >
            ← Powrót do panelu
          </Link>

          <h1 className="mt-5 text-3xl font-bold tracking-tight">
            Dodaj ofertę pracy
          </h1>

          <p className="mt-3 text-zinc-400">
            Uzupełnij informacje o stanowisku, które chcesz opublikować.
          </p>
        </div>

        <form
          action={createJob}
          className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6"
        >
          <div className="space-y-2">
            <Label htmlFor="title">Nazwa stanowiska</Label>
            <Input
              id="title"
              name="title"
              type="text"
              required
              placeholder="np. Junior Data Analyst"
              className="border-zinc-700 bg-zinc-950 text-white placeholder:text-zinc-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Nazwa firmy</Label>
            <Input
              id="company"
              name="company"
              type="text"
              required
              placeholder="np. DevJobs Demo"
              className="border-zinc-700 bg-zinc-950 text-white placeholder:text-zinc-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Lokalizacja</Label>
            <Input
              id="location"
              name="location"
              type="text"
              required
              placeholder="np. Warszawa"
              className="border-zinc-700 bg-zinc-950 text-white placeholder:text-zinc-500"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Kategoria</Label>
              <select
                id="category"
                name="category"
                required
                defaultValue="OTHER"
                className="flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none transition focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500/30"
              >
                <option value="IT">IT</option>
                <option value="FINANCE">Finanse</option>
                <option value="MARKETING">Marketing</option>
                <option value="LOGISTICS">Logistyka</option>
                <option value="ADMINISTRATION">Administracja</option>
                <option value="ENGINEERING">Inżynieria</option>
                <option value="OTHER">Inne</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="employmentType">Rodzaj zatrudnienia</Label>
              <select
                id="employmentType"
                name="employmentType"
                required
                defaultValue="FULL_TIME"
                className="flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none transition focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500/30"
              >
                <option value="FULL_TIME">Pełny etat</option>
                <option value="PART_TIME">Niepełny etat</option>
                <option value="CONTRACT">B2B</option>
                <option value="MANDATE">Umowa zlecenie</option>
                <option value="INTERNSHIP">Staż</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workMode">Tryb pracy</Label>
            <select
              id="workMode"
              name="workMode"
              required
              defaultValue="OFFICE"
              className="flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none transition focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500/30"
            >
              <option value="REMOTE">Zdalna</option>
              <option value="HYBRID">Hybrydowa</option>
              <option value="OFFICE">Stacjonarna</option>
            </select>
          </div>

          <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-950/60 p-4">
            <div>
              <h2 className="font-semibold">Wynagrodzenie</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Podaj miesięczne wynagrodzenie brutto. To pole jest opcjonalne.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="salaryMin">Od</Label>
                <Input
                  id="salaryMin"
                  name="salaryMin"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="np. 8000"
                  className="border-zinc-700 bg-zinc-950 text-white placeholder:text-zinc-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salaryMax">Do</Label>
                <Input
                  id="salaryMax"
                  name="salaryMax"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="np. 12000"
                  className="border-zinc-700 bg-zinc-950 text-white placeholder:text-zinc-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salaryCurrency">Waluta</Label>
              <select
                id="salaryCurrency"
                name="salaryCurrency"
                defaultValue="PLN"
                className="flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none transition focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500/30"
              >
                <option value="PLN">PLN – polski złoty</option>
                <option value="EUR">EUR – euro</option>
                <option value="USD">USD – dolar amerykański</option>
                <option value="GBP">GBP – funt brytyjski</option>
                <option value="CHF">CHF – frank szwajcarski</option>
                <option value="CZK">CZK – korona czeska</option>
                <option value="SEK">SEK – korona szwedzka</option>
                <option value="NOK">NOK – korona norweska</option>
                <option value="DKK">DKK – korona duńska</option>
              </select>
            </div>

            <p className="text-xs text-zinc-500">
              Kwoty są miesięczne i brutto. Możesz pozostawić oba pola puste.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Opis stanowiska</Label>
            <textarea
              id="description"
              name="description"
              required
              rows={7}
              placeholder="Opisz obowiązki, wymagania i oferowane warunki..."
              className="flex min-h-32 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white shadow-xs outline-none transition-colors placeholder:text-zinc-500 focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500/30"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <Button
              type="submit"
              className="bg-emerald-500 font-semibold text-zinc-950 hover:bg-emerald-400"
            >
              Zapisz ofertę
            </Button>

            <Button asChild variant="outline">
              <Link href="/employer">Anuluj</Link>
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
