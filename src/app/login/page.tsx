
"use client";

import Link from "next/link";
import { signIn, getSession } from "next-auth/react";
import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
        router.replace("/employer");
      } else {
        router.replace("/jobs");
      }

router.refresh();
    } catch {
      setMessage("Wystąpił błąd podczas logowania.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12 text-foreground">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            Dev<span className="text-primary">Jobs</span>
          </Link>
          <h1 className="mt-8 text-3xl font-bold tracking-tight">
            Witaj ponownie
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Zaloguj się do swojego konta DevJobs.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl border bg-card p-6 shadow-sm sm:p-8"
        >
          {registered && (
            <p className="rounded-lg border border-green-800/30 bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">
              Konto zostało utworzone pomyślnie! Możesz się teraz zalogować.
            </p>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="jan@example.com"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Hasło</Label>
            <Input
              id="password"
              type="password"
              placeholder="Wpisz swoje hasło"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {message && (
            <p
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
            >
              {message}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logowanie..." : "Zaloguj się"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Nie masz jeszcze konta?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Zarejestruj się
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
