import Link from "next/link";
import { auth, signOut } from "@/auth";
import ProfileMenu from "@/components/profile-menu";

export default async function Navbar() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="border-b border-zinc-800 bg-zinc-950 text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/jobs" className="text-2xl font-bold tracking-tight">
          Dev<span className="text-emerald-400">Jobs</span>
        </Link>

        <div className="flex items-center gap-5 text-sm">
          <Link
            href="/jobs"
            className="text-zinc-300 transition hover:text-emerald-400"
          >
            Oferty pracy
          </Link>
        {user?.role === "CANDIDATE" && (
  <ProfileMenu name={user.name || "Moje konto"}> 
    <Link
    href="/profile"
    className="block rounded-lg px-3 py-2 hover:bg-zinc-800"
    >
    Mój profil
    </Link>
    <Link
      href="/my-applications"
      className="block rounded-lg px-3 py-2 hover:bg-zinc-800"
    >
      Moje aplikacje
    </Link>

    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/jobs" });
      }}
    >
      <button
        type="submit"
        className="w-full rounded-lg px-3 py-2 text-left text-red-400 hover:bg-zinc-800"
      >
        Wyloguj się
      </button>
    </form>
  </ProfileMenu>
)}

          {user?.role === "EMPLOYER" && (
            <details className="relative">
              <summary className="cursor-pointer list-none rounded-lg border border-zinc-700 px-4 py-2 hover:border-emerald-400">
                {user.name || "Pracodawca"} ▾
              </summary>

              <div className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-zinc-800 bg-zinc-900 p-2 shadow-xl">
                <Link
                  href="/employer"
                  className="block rounded-lg px-3 py-2 hover:bg-zinc-800"
                >
                  Panel pracodawcy
                </Link>

                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/jobs" });
                  }}
                >
                  <button
                    type="submit"
                    className="w-full rounded-lg px-3 py-2 text-left text-red-400 hover:bg-zinc-800"
                  >
                    Wyloguj się
                  </button>
                </form>
              </div>
            </details>
          )}

          {!user && (
            <>
              <Link
                href="/login"
                className="text-zinc-300 transition hover:text-emerald-400"
              >
                Zaloguj się
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-emerald-500 px-4 py-2 font-medium text-zinc-950 transition hover:bg-emerald-400"
              >
                Rejestracja
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
