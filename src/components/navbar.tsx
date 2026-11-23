
import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/auth";
import ProfileMenu from "@/components/profile-menu";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export default async function Navbar() {
  const requestHeaders = await headers();
  const hostname = requestHeaders.get("host")?.split(":")[0];
  const isEmployerSubdomain =
    hostname === "pracodawca.devjobs.localhost";

  const session = await auth();
  const user = session?.user;

  const unreadNotificationsCount =
    user?.role === "CANDIDATE"
      ? await prisma.notification.count({
          where: {
            userId: user.id,
            isRead: false,
          },
        })
      : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/90 text-white backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href={user?.role === "ADMIN" ? "/admin" : "/"}
          aria-label="DevJobs - strona główna"
          className="group shrink-0 text-2xl font-extrabold tracking-tight transition"
        >
          <span className="text-white group-hover:text-zinc-200">
            Dev
          </span>
          <span className="text-emerald-400 group-hover:text-emerald-300">
            Jobs
          </span>
        </Link>

        <div className="flex items-center gap-2 text-sm sm:gap-5">
          {user?.role === "ADMIN" && (
            <ProfileMenu name={user.name || "Administrator"}>
              <Link
                href="/admin"
                className="block rounded-lg px-3 py-2 transition hover:bg-zinc-800"
              >
                Panel admina
              </Link>
            </ProfileMenu>
          )}

          {user?.role === "CANDIDATE" && (
            <>
              <Link
                href="/jobs"
                className="hidden rounded-lg px-3 py-2 text-zinc-300 transition hover:bg-zinc-900 hover:text-emerald-400 sm:block"
              >
                Oferty pracy
              </Link>

              <ProfileMenu name={user.name || "Moje konto"}>
                <Link
                  href="/notifications"
                  className="flex items-center justify-between rounded-lg px-3 py-2 transition hover:bg-zinc-800"
                >
                  <span>Powiadomienia</span>

                  {unreadNotificationsCount > 0 && (
                    <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-xs font-semibold text-blue-400">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </Link>

                <Link
                  href="/profile"
                  className="block rounded-lg px-3 py-2 transition hover:bg-zinc-800"
                >
                  Mój profil
                </Link>

                <Link
                  href="/my-applications"
                  className="block rounded-lg px-3 py-2 transition hover:bg-zinc-800"
                >
                  Moje aplikacje
                </Link>

                <Link
                  href="/saved-jobs"
                  className="block rounded-lg px-3 py-2 transition hover:bg-zinc-800"
                >
                  Zapisane oferty
                </Link>
              </ProfileMenu>
            </>
          )}

          {user?.role === "EMPLOYER" && (
            <>
              <Link
                href="/jobs"
                className="hidden rounded-lg px-3 py-2 text-zinc-300 transition hover:bg-zinc-900 hover:text-emerald-400 sm:block"
              >
                Oferty pracy
              </Link>

              <ProfileMenu name={user.name || "Pracodawca"}>
                <Link
                  href="/employer"
                  className="block rounded-lg px-3 py-2 transition hover:bg-zinc-800"
                >
                  Panel pracodawcy
                </Link>
              </ProfileMenu>
            </>
          )}

          {!user && (
            <>
              {!isEmployerSubdomain && (
                <Link
                  href="/jobs"
                  className="hidden rounded-lg px-3 py-2 text-zinc-300 transition hover:bg-zinc-900 hover:text-emerald-400 sm:block"
                >
                  Oferty pracy
                </Link>
              )}

              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
              >
                Zaloguj się
              </Link>

              <Button
                asChild
                className="bg-emerald-500 font-semibold text-zinc-950 hover:bg-emerald-400"
              >
                <Link href="/register">Rejestracja</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
