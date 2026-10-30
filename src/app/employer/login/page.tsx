
"use client";

import Link from "next/link";
import { signIn, getSession } from "next-auth/react";
import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function EmployerLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered") === "true";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setMessage("Nieprawidłowy e-mail lub hasło.");
        return;
      }

      const session = await getSession();

      if (session?.user?.role !== "EMPLOYER") {
        setMessage(
          "To konto nie jest kontem pracodawcy. Skorzystaj z logowania kandydata.",
        );
        return;
      }

      router.push("/employer");
    } catch {
      setMessage("Wystąpił błąd podczas logowania.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-10 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-8"
      >
        <div>
          <Link href="/" className="text-sm text-blue-400 hover:underline">
            ← Powrót do strony głównej
          </Link>
          <h1 className="mt-5 text-3xl font-bold">Panel pracodawcy</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Zaloguj się, aby zarządzać ofertami i rekrutacją.
          </p>
        </div>

        {registered && (
          <p className="rounded-lg border border-emerald-800 bg-emerald-950 p-3 text-sm text-emerald-300">
            Konto pracodawcy zostało utworzone. Możesz się teraz zalogować.
          </p>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-emerald-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Hasło
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-emerald-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-semibold transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Logowanie..." : "Zaloguj się jako pracodawca"}
        </button>

        {message && (
          <p role="alert" className="text-sm text-red-400">
            {message}
          </p>
        )}

        <p className="text-center text-sm text-zinc-400">
          Nie masz konta pracodawcy?{" "}
          <Link
            href="/employer/register"
            className="text-emerald-400 hover:underline"
          >
            Zarejestruj się
          </Link>
        </p>

        <p className="text-center text-sm text-zinc-500">
          Rekrutujesz pracowników?{" "}
          <Link
            href="/employer/login"
            className="text-emerald-400 hover:underline"
          >
            Panel pracodawcy
          </Link>
        </p>

        <p className="text-center text-sm text-zinc-500">
          Szukasz pracy?{" "}
          <Link href="/login" className="text-blue-400 hover:underline">
            Logowanie kandydata
          </Link>
        </p>
      </form>
    </main>
  );
}
