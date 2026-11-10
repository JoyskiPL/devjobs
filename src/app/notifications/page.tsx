
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {markNotificationAsRead, markAllNotificationsAsRead,} from "./actions";

export default async function NotificationsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const notifications = await prisma.notification.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/jobs"
          className="text-sm text-zinc-400 transition hover:text-white"
        >
          ← Powrót do ofert
        </Link>

        <div className="mb-8 mt-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Powiadomienia
          </h1>

          <p className="mt-2 text-zinc-400">
            Masz {unreadCount} nieprzeczytanych powiadomień.
          </p>
          {unreadCount > 0 && (
        <form action={markAllNotificationsAsRead} className="mt-4">
            <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
            >
            Oznacz wszystkie jako przeczytane
            </button>
        </form>
        )}
        </div>

        {notifications.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-10 text-center">
            <h2 className="text-lg font-semibold">
              Brak powiadomień
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Gdy pojawią się nowe informacje dotyczące Twoich zgłoszeń, zobaczysz je tutaj.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-xl border p-5 ${
                  notification.isRead
                    ? "border-zinc-800 bg-zinc-900/40"
                    : "border-blue-500/30 bg-blue-500/5"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold">
                      {notification.title}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-zinc-300">
                      {notification.message}
                    </p>

                    <p className="mt-3 text-xs text-zinc-500">
                      {new Intl.DateTimeFormat("pl-PL", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(notification.createdAt)}
                    </p>
                  </div>

                  {!notification.isRead && (
                <div className="flex shrink-0 flex-col items-end gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />

                    <form
                    action={markNotificationAsRead.bind(null, notification.id)}
                    >
                    <button
                        type="submit"
                        className="text-xs text-blue-400 transition hover:text-blue-300"
                    >
                        Oznacz jako przeczytane
                    </button>
                    </form>
                </div>
                )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
