
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 py-12 text-white">
      <div className="mx-auto w-full max-w-5xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
            DevJobs
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-6xl">
            Znajdź swoją kolejną
            <span className="block text-blue-400">możliwość</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-zinc-400">
            Miejsce, w którym talenty spotykają się z pracodawcami.
            Wybierz, czego dziś potrzebujesz.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 transition hover:border-blue-500">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-950 text-3xl">
              👨‍💻
            </div>
            <h2 className="mt-6 text-2xl font-bold">Szukam pracy</h2>
            <p className="mt-3 leading-7 text-zinc-400">
              Przeglądaj oferty, aplikuj na interesujące stanowiska
              i śledź status swoich aplikacji w jednym miejscu.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <Link
                href="/jobs"
                className="rounded-lg bg-blue-600 px-5 py-3 text-center font-semibold transition hover:bg-blue-500"
              >
                Przeglądaj oferty
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-zinc-700 px-5 py-3 text-center font-medium transition hover:bg-zinc-800"
              >
                Logowanie kandydata
              </Link>
              <Link
                href="/register"
                className="text-center text-sm text-blue-400 hover:underline"
              >
                Nie masz konta? Zarejestruj się
              </Link>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 transition hover:border-emerald-500">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-950 text-3xl">
              🏢
            </div>
            <h2 className="mt-6 text-2xl font-bold">Rekrutuję pracowników</h2>
            <p className="mt-3 leading-7 text-zinc-400">
              Publikuj oferty pracy, przeglądaj zgłoszenia kandydatów
              i zarządzaj procesem rekrutacji.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <Link
                href="/employer/login"
                className="rounded-lg bg-emerald-600 px-5 py-3 text-center font-semibold transition hover:bg-emerald-500"
              >
                Panel pracodawcy
              </Link>
              <Link
                href="/employer/register"
                className="rounded-lg border border-zinc-700 px-5 py-3 text-center font-medium transition hover:bg-zinc-800"
              >
                Utwórz konto pracodawcy
              </Link>
            </div>
          </section>
        </div>

        <p className="mt-10 text-center text-sm text-zinc-600">
          DevJobs · Twoja kariera zaczyna się tutaj.
        </p>
      </div>
    </main>
  );
}
