
"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function EmployerRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/employer/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data: { message?: string; error?: string } =
        await response.json();

      if (!response.ok) {
        setMessage(data.error ?? "Nie udało się utworzyć konta.");
        return;
      }

      router.push("/employer/login?registered=true");
    } catch {
      setMessage("Nie udało się połączyć z serwerem.");
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
          <h1 className="mt-5 text-3xl font-bold">Konto pracodawcy</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Dołącz do DevJobs i zacznij publikować oferty pracy.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">
            Imię i nazwisko lub nazwa osoby kontaktowej
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            maxLength={80}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
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
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={72}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-blue-500"
          />
          <p className="text-xs text-zinc-500">
            Hasło musi mieć co najmniej 8 znaków.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-semibold transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Tworzenie konta..." : "Utwórz konto pracodawcy"}
        </button>

        {message && (
          <p role="alert" className="text-sm text-red-400">
            {message}
          </p>
        )}

        <p className="text-center text-sm text-zinc-400">
          Masz już konto pracodawcy?{" "}
          <Link
            href="/employer/login"
            className="text-blue-400 hover:underline"
          >
            Zaloguj się
          </Link>
        </p>
      </form>
    </main>
  );
}
