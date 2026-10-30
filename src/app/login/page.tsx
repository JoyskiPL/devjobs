
"use client";

import Link from "next/link";
import { signIn, getSession } from "next-auth/react";
import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
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

      if (session?.user?.role === "EMPLOYER") {
        router.push("/employer");
      } else {
        router.push("/jobs");
      }
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
          <h1 className="text-3xl font-bold">Witaj ponownie</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Zaloguj się do swojego konta DevJobs.
          </p>
        </div>

        {registered && (
          <p className="rounded-lg border border-green-800 bg-green-950 p-3 text-sm text-green-300">
            Konto zostało utworzone pomyślnie! Możesz się teraz zalogować.
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
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
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
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Logowanie..." : "Zaloguj się"}
        </button>

        {message && (
          <p role="alert" className="text-sm text-red-400">
            {message}
          </p>
        )}

        <p className="text-center text-sm text-zinc-400">
          Nie masz jeszcze konta?{" "}
          <Link href="/register" className="text-blue-400 hover:underline">
            Zarejestruj się
          </Link>
        </p>
      </form>
    </main>
  );
}
