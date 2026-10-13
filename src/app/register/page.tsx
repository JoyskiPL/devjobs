
"use client";

import { FormEvent, useState } from "react";

export default function RegisterPage() {
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
      const response = await fetch("/api/register", {
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

      setMessage("Konto utworzone! Możesz teraz przejść do logowania.");
      setName("");
      setEmail("");
      setPassword("");
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
          <h1 className="text-3xl font-bold">Utwórz konto</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Dołącz do DevJobs i znajdź swoją kolejną pracę.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">
            Imię
          </label>
          <input
            id="name"
            name="name"
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
            name="email"
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
            name="password"
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
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Tworzenie konta..." : "Zarejestruj się"}
        </button>

        {message && (
          <p role="status" className="text-sm text-zinc-300">
            {message}
          </p>
        )}

        <p className="text-center text-sm text-zinc-400">
          Masz już konto?{" "}
          <a href="/api/auth/signin" className="text-blue-400 hover:underline">
            Zaloguj się
          </a>
        </p>
      </form>
    </main>
  );
}
