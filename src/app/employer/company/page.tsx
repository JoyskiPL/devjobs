
import Link from "next/link";
import { requireEmployer } from "@/lib/employer";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveCompany } from "./actions";

export default async function CompanyPage() {
  const user = await requireEmployer();

  const company = await prisma.company.findUnique({
    where: {
      ownerId: user.id,
    },
  });

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
            Profil firmy
          </h1>

          <p className="mt-3 text-zinc-400">
            Uzupełnij informacje o swojej firmie, które będą widoczne dla kandydatów.
          </p>
        </div>

        <form
          action={saveCompany}
          className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Nazwa firmy</Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={company?.name ?? ""}
              placeholder="np. DevJobs Technologies"
              className="border-zinc-700 bg-zinc-950 text-white placeholder:text-zinc-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Opis firmy</Label>
            <textarea
              id="description"
              name="description"
              rows={6}
              defaultValue={company?.description ?? ""}
              placeholder="Opowiedz kandydatom o swojej firmie..."
              className="flex min-h-32 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nip">NIP</Label>
            <Input
              id="nip"
              name="nip"
              defaultValue={company?.nip ?? ""}
              placeholder="np. 1234567890"
              className="border-zinc-700 bg-zinc-950 text-white placeholder:text-zinc-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Lokalizacja</Label>
            <Input
              id="location"
              name="location"
              defaultValue={company?.location ?? ""}
              placeholder="np. Warszawa"
              className="border-zinc-700 bg-zinc-950 text-white placeholder:text-zinc-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Strona internetowa</Label>
            <div className="flex">
              <span className="flex items-center rounded-l-md border border-r-0 border-zinc-700 bg-zinc-800 px-3 text-sm text-zinc-400">
                https://
              </span>

              <Input
                id="website"
                name="website"
                type="text"
                defaultValue={company?.website?.replace(/^https?:\/\//, "") ?? ""}
                placeholder="twojafirma.com"
                className="rounded-l-none border-zinc-700 bg-zinc-950 text-white placeholder:text-zinc-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoUrl">Adres URL logo firmy</Label>
            <Input
              id="logoUrl"
              name="logoUrl"
              type="url"
              defaultValue={company?.logoUrl ?? ""}
              placeholder="https://twojafirma.pl/logo.png"
              className="border-zinc-700 bg-zinc-950 text-white placeholder:text-zinc-500"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <Button type="submit">
              Zapisz profil
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
