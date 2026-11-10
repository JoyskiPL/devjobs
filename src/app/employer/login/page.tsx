
"use client";

import Link from "next/link";
import { signIn, getSession } from "next-auth/react";
import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

      window.location.assign("/employer");
    } catch {
      setMessage("Wystąpił błąd podczas logowania.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12 text-foreground">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            Dev<span className="text-primary">Jobs</span>
          </Link>
          <h1 className="mt-8 text-3xl font-bold tracking-tight">
            Panel pracodawcy
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Zaloguj się, aby zarządzać ofertami i rekrutacją.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-xl border bg-card p-6 shadow-sm"
        >
          {registered && (
            <p className="rounded-lg border border-emerald-800 bg-emerald-950 p-3 text-sm text-emerald-300">
              Konto pracodawcy zostało utworzone. Możesz się teraz zalogować.
            </p>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Adres e-mail</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="jan@firma.pl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Hasło</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Wpisz swoje hasło"
            />
          </div>

          {message && (
            <p role="alert" className="text-sm text-destructive">
              {message}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logowanie..." : "Zaloguj się jako pracodawca"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Nie masz konta pracodawcy?{" "}
            <Link
              href="/employer/register"
              className="font-medium text-primary hover:underline"
            >
              Zarejestruj się
            </Link>
          </p>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Szukasz pracy?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Logowanie kandydata
          </Link>
        </p>

        <p className="text-center text-sm">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground"
          >
            ← Powrót do strony głównej
          </Link>
        </p>
      </div>
    </main>
  );
}
