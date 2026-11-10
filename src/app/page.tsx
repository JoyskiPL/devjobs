
import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
  {
    number: "01",
    title: "Oferty w jednym miejscu",
    description:
      "Odkrywaj interesujące stanowiska i znajdź pracę dopasowaną do swoich oczekiwań.",
    color: "text-blue-400",
  },
  {
    number: "02",
    title: "Kontrola nad aplikacjami",
    description:
      "Aplikuj na wybrane oferty i wygodnie sprawdzaj status swoich zgłoszeń.",
    color: "text-emerald-400",
  },
  {
    number: "03",
    title: "Prosta rekrutacja",
    description:
      "Publikuj oferty, przeglądaj kandydatów i zarządzaj rekrutacją w jednym panelu.",
    color: "text-violet-400",
  },
];

export default function Home() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-zinc-950 text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-16rem] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-blue-600/15 blur-[120px]" />
        <div className="absolute -left-40 top-[35rem] h-80 w-80 rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="absolute -right-40 top-[55rem] h-80 w-80 rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-20 sm:px-6 sm:pt-28 lg:px-8">
        <section className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
            <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.8)]" />
            Twoje miejsce na rynku pracy
          </div>

          <h1 className="mt-8 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Znajdź pracę, która
            <span className="mt-2 block bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
              daje możliwości.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
            DevJobs łączy osoby szukające nowych wyzwań z pracodawcami.
            Przeglądaj oferty, rozwijaj swoją karierę i rekrutuj
            odpowiednich ludzi do swojego zespołu.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 bg-blue-600 px-7 text-white hover:bg-blue-500"
            >
              <Link href="/jobs">
                Przeglądaj oferty
                <span aria-hidden="true" className="ml-2">→</span>
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-zinc-700 bg-zinc-900/50 px-7 text-white hover:bg-zinc-800 hover:text-white"
            >
              <Link href="/employer/login">
                Jestem pracodawcą
              </Link>
            </Button>
          </div>

          <p className="mt-5 text-sm text-zinc-500">
            Szukasz pracy?{" "}
            <Link
              href="/register"
              className="font-medium text-blue-400 transition hover:text-blue-300"
            >
              Utwórz darmowe konto
            </Link>
          </p>
        </section>

        <section className="mx-auto mt-20 grid max-w-5xl gap-5 md:grid-cols-2">
          <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-blue-500/20 bg-zinc-900/70 p-7 transition duration-300 hover:-translate-y-1 hover:border-blue-500/50 sm:p-9">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl transition group-hover:bg-blue-500/20" />

            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-2xl">
              👨‍💻
            </div>

            <div className="relative mt-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                Dla kandydatów
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                Czas na kolejny krok.
              </h2>

              <p className="mt-3 max-w-md leading-7 text-zinc-400">
                Znajdź stanowisko, które odpowiada Twoim umiejętnościom.
                Aplikuj i kontroluj swoje zgłoszenia w jednym miejscu.
              </p>
            </div>

            <div className="relative mt-8">
              <Button
                asChild
                className="bg-blue-600 text-white hover:bg-blue-500"
              >
                <Link href="/jobs">Znajdź pracę →</Link>
              </Button>

              <Link
                href="/login"
                className="ml-4 text-sm text-zinc-400 transition hover:text-white"
              >
                Logowanie
              </Link>
            </div>
          </div>

          <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-emerald-500/20 bg-zinc-900/70 p-7 transition duration-300 hover:-translate-y-1 hover:border-emerald-500/50 sm:p-9">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl transition group-hover:bg-emerald-500/20" />

            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-2xl">
              🏢
            </div>

            <div className="relative mt-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                Dla pracodawców
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                Znajdź ludzi do zespołu.
              </h2>

              <p className="mt-3 max-w-md leading-7 text-zinc-400">
                Publikuj ogłoszenia, poznawaj kandydatów i zarządzaj
                procesem rekrutacji z poziomu jednego panelu.
              </p>
            </div>

            <div className="relative mt-8">
              <Button
                asChild
                className="bg-emerald-600 text-white hover:bg-emerald-500"
              >
                <Link href="/employer/login">
                  Panel pracodawcy →
                </Link>
              </Button>

              <Link
                href="/employer/register"
                className="ml-4 text-sm text-zinc-400 transition hover:text-white"
              >
                Rejestracja
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-24 max-w-5xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              Dlaczego DevJobs?
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Wszystko, czego potrzebujesz.
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-zinc-400">
              Proste narzędzia, które ułatwiają szukanie pracy
              i prowadzenie rekrutacji.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.number}
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 transition hover:border-zinc-700 hover:bg-zinc-900/70"
              >
                <span className={`text-sm font-bold ${feature.color}`}>
                  {feature.number}
                </span>

                <h3 className="mt-5 text-lg font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-24 border-t border-zinc-800 pt-7 text-center">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} DevJobs. Twoja kariera zaczyna się tutaj.
          </p>
        </footer>
      </div>
    </main>
  );
}
