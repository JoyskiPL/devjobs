
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { updateProfile } from "./actions";

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
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/jobs"
          className="text-sm text-emerald-400 hover:text-emerald-300"
        >
          ← Powrót do ofert
        </Link>

        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
          <h1 className="text-3xl font-bold">Mój profil</h1>
          <p className="mt-2 text-zinc-400">
            Zarządzaj swoimi danymi i informacjami o doświadczeniu.
          </p>

          {params.saved === "1" && (
            <p className="mt-6 rounded-lg border border-emerald-800 bg-emerald-950 p-3 text-emerald-300">
              Profil został zapisany.
            </p>
          )}

          {params.error === "name" && (
            <p className="mt-6 rounded-lg border border-red-800 bg-red-950 p-3 text-red-300">
              Imię i nazwisko nie mogą być puste.
            </p>
          )}

          {params.error === "length" && (
            <p className="mt-6 rounded-lg border border-red-800 bg-red-950 p-3 text-red-300">
              Jedno z pól przekracza dozwoloną długość.
            </p>
          )}

          <form action={updateProfile} className="mt-8 space-y-6">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium">
                Imię i nazwisko
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                maxLength={100}
                defaultValue={user.name ?? ""}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Adres e-mail
              </label>
              <input
                id="email"
                type="email"
                disabled
                value={user.email ?? ""}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-500"
              />
              <p className="mt-2 text-xs text-zinc-500">
                Adres e-mail jest obecnie tylko do odczytu.
              </p>
            </div>

            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                Numer telefonu
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                maxLength={30}
                defaultValue={user.phone ?? ""}
                placeholder="np. 500 600 700"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium"
              >
                O mnie i moje doświadczenie
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                maxLength={3000}
                defaultValue={user.description ?? ""}
                placeholder="Opisz swoje umiejętności, doświadczenie i kierunek rozwoju..."
                className="w-full resize-y rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-emerald-400"
              />
              <p className="mt-2 text-xs text-zinc-500">
                Maksymalnie 3000 znaków.
              </p>
            </div>

            <button
              type="submit"
              className="rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-zinc-950 transition hover:bg-emerald-400"
            >
              Zapisz zmiany
            </button>
          </form>

          <div className="mt-10 border-t border-zinc-800 pt-6">
            <h2 className="text-xl font-semibold">Moje CV</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Prześlij swoje CV w formacie PDF. Maksymalny rozmiar pliku to 5 MB.
            </p>

            {params.cvUploaded === "1" && (
              <p className="mt-4 rounded-lg border border-emerald-800 bg-emerald-950 p-3 text-emerald-300">
                CV zostało przesłane pomyślnie.
              </p>
            )}

            {params.cvError && (
              <p className="mt-4 rounded-lg border border-red-800 bg-red-950 p-3 text-red-300">
                {params.cvError === "size"
                  ? "Plik jest za duży. Maksymalny rozmiar to 5 MB."
                  : params.cvError === "type"
                    ? "Wybierz prawidłowy plik PDF."
                    : "Wybierz plik CV przed wysłaniem."}
              </p>
            )}

            {user.cvUrl && (
              <p className="mt-4 text-sm text-emerald-300">
                <span className="mr-2">✓</span>
                CV jest zapisane na Twoim profilu.
              </p>
            )}

            <form
              action="/api/profile/cv"
              method="POST"
              encType="multipart/form-data"
              className="mt-5 space-y-4"
            >
              <input
                type="file"
                name="cv"
                accept=".pdf,application/pdf"
                required
                className="block w-full text-sm text-zinc-300 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-4 file:py-2 file:text-white hover:file:bg-zinc-700"
              />

              <button
                type="submit"
                formNoValidate
                className="rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-zinc-950 transition hover:bg-emerald-400"
              >
                Prześlij CV
              </button>
            </form>
          </div>

          <div className="mt-10 border-t border-zinc-800 pt-6">
            <h2 className="text-xl font-semibold">Moje aplikacje</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Sprawdź oferty, na które już aplikowałeś.
            </p>
            <Link
              href="/my-applications"
              className="mt-4 inline-block rounded-lg border border-zinc-700 px-4 py-2 transition hover:border-emerald-400"
            >
              Zobacz aplikacje →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
