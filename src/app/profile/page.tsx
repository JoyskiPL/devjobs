
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { updateProfile } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ProfilePageProps = {
  searchParams: Promise<{
    saved?: string;
    error?: string;
    cvUploaded?: string;
    cvError?: string;
  }>;
};

export default async function ProfilePage({
  searchParams,
}: ProfilePageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "CANDIDATE") {
    redirect("/jobs");
  }

  const [user, params] = await Promise.all([
    prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        name: true,
        email: true,
        phone: true,
        description: true,
        cvUrl: true,
      },
    }),
    searchParams,
  ]);

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-12 text-white sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/jobs"
          className="text-sm text-zinc-400 transition hover:text-white"
        >
          ← Powrót do ofert
        </Link>

        <div className="mt-6">
          <p className="text-sm font-medium text-blue-400">
            DevJobs / Konto kandydata
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Mój profil
          </h1>

          <p className="mt-3 text-zinc-400">
            Zarządzaj swoimi danymi i informacjami o doświadczeniu.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Dane osobowe</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Uzupełnij informacje widoczne w Twoim profilu.
              </p>
            </div>

            {params.saved === "1" && (
              <p className="mb-6 rounded-lg border border-emerald-800 bg-emerald-950 p-3 text-sm text-emerald-300">
                Profil został zapisany.
              </p>
            )}

            {params.error === "name" && (
              <p className="mb-6 rounded-lg border border-red-800 bg-red-950 p-3 text-sm text-red-300">
                Imię i nazwisko nie mogą być puste.
              </p>
            )}

            {params.error === "length" && (
              <p className="mb-6 rounded-lg border border-red-800 bg-red-950 p-3 text-sm text-red-300">
                Jedno z pól przekracza dozwoloną długość.
              </p>
            )}

            <form action={updateProfile} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Imię i nazwisko</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  maxLength={100}
                  defaultValue={user.name ?? ""}
                  className="border-zinc-700 bg-zinc-950 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Adres e-mail</Label>
                <Input
                  id="email"
                  type="email"
                  disabled
                  value={user.email ?? ""}
                  className="border-zinc-800 bg-zinc-950 text-zinc-300"
                />
                <p className="text-xs text-zinc-500">
                  Adres e-mail jest obecnie tylko do odczytu.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Numer telefonu</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  maxLength={30}
                  defaultValue={user.phone ?? ""}
                  placeholder="np. 500 600 700"
                  className="border-zinc-700 bg-zinc-950 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  O mnie i moje doświadczenie
                </Label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  maxLength={3000}
                  defaultValue={user.description ?? ""}
                  placeholder="Opisz swoje umiejętności, doświadczenie i kierunek rozwoju..."
                  className="flex min-h-32 w-full resize-y rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white shadow-xs outline-none transition-colors placeholder:text-zinc-500 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
                <p className="text-xs text-zinc-500">
                  Maksymalnie 3000 znaków.
                </p>
              </div>

              <Button type="submit">
                Zapisz zmiany
              </Button>
            </form>
          </section>

          <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
            <div>
              <h2 className="text-xl font-semibold">Moje CV</h2>
              <p className="mt-2 text-sm text-zinc-400">
                Prześlij swoje CV w formacie PDF. Maksymalny rozmiar pliku to 5 MB.
              </p>
            </div>

            {params.cvUploaded === "1" && (
              <p className="mt-5 rounded-lg border border-emerald-800 bg-emerald-950 p-3 text-sm text-emerald-300">
                CV zostało przesłane pomyślnie.
              </p>
            )}

            {params.cvError && (
              <p className="mt-5 rounded-lg border border-red-800 bg-red-950 p-3 text-sm text-red-300">
                {params.cvError === "size"
                  ? "Plik jest za duży. Maksymalny rozmiar to 5 MB."
                  : params.cvError === "type"
                    ? "Wybierz prawidłowy plik PDF."
                    : "Wybierz plik CV przed wysłaniem."}
              </p>
            )}

            {user.cvUrl && (
              <p className="mt-5 rounded-lg border border-emerald-800/50 bg-emerald-950/30 p-3 text-sm text-emerald-300">
                ✓ CV jest zapisane na Twoim profilu.
              </p>
            )}

            <form
              action="/api/profile/cv"
              method="POST"
              encType="multipart/form-data"
              className="mt-6 space-y-4"
            >
              <Input
                type="file"
                name="cv"
                accept=".pdf,application/pdf"
                required
                className="h-auto min-h-12 cursor-pointer border-zinc-700 bg-zinc-950 p-2 text-sm leading-8 text-zinc-300 file:mr-4 file:inline-flex file:h-8 file:items-center file:rounded-md file:border-0 file:bg-zinc-800 file:px-4 file:align-middle file:text-sm file:leading-normal file:text-white hover:file:bg-zinc-700"
              />

              <Button type="submit" formNoValidate>
                Prześlij CV
              </Button>
            </form>
          </section>

          <section className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
            <h2 className="text-xl font-semibold">Moje aplikacje</h2>

            <p className="mt-2 text-sm text-zinc-400">
              Sprawdź oferty, na które już aplikowałeś.
            </p>

            <Button asChild variant="outline" className="mt-5">
              <Link href="/my-applications">
                Zobacz aplikacje →
              </Link>
            </Button>
          </section>
        </div>
      </div>
    </main>
  );
}
