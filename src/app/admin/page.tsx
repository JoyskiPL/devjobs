
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  await requireAdmin();

  const [usersCount, jobsCount, applicationsCount] = await Promise.all([
    prisma.user.count(),
    prisma.job.count(),
    prisma.application.count(),
  ]);

  const sections = [
    {
      title: "Użytkownicy",
      description: "Przeglądaj konta, wyszukuj użytkowników i zarządzaj rolami.",
      count: usersCount,
      href: "/admin/users",
      label: "Zarządzaj użytkownikami",
    },
    {
      title: "Oferty pracy",
      description: "Przeglądaj oferty, filtruj je i moderuj ogłoszenia.",
      count: jobsCount,
      href: "/admin/jobs",
      label: "Zarządzaj ofertami",
    },
    {
      title: "Aplikacje",
      description: "Przeglądaj zgłoszenia kandydatów i ich statusy.",
      count: applicationsCount,
      href: "/admin/applications",
      label: "Zarządzaj aplikacjami",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0a0f1c] px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="mb-2 text-sm font-medium text-blue-400">
            DEVJOBS ADMINISTRATION
          </p>

          <h1 className="text-3xl font-bold">Panel administratora</h1>

          <p className="mt-2 text-gray-400">
            Zarządzaj użytkownikami, ofertami pracy i zgłoszeniami.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-blue-500/40 hover:bg-white/[0.06]"
            >
              <p className="text-sm text-gray-400">{section.title}</p>

              <p className="mt-3 text-4xl font-bold">{section.count}</p>

              <p className="mt-4 min-h-12 text-sm leading-6 text-gray-400">
                {section.description}
              </p>

              <p className="mt-5 text-sm font-medium text-blue-400 transition group-hover:text-blue-300">
                {section.label} →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
