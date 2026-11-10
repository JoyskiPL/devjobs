
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { updateJob } from "./actions";
import DeleteJobButton from "./delete-job-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type EditJobPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditJobPage({
  params,
  searchParams,
}: EditJobPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "EMPLOYER") {
    redirect("/");
  }

  const { id } = await params;
  const { error } = await searchParams;
  const jobId = Number(id);

  if (!Number.isInteger(jobId) || jobId <= 0) {
    notFound();
  }

  const job = await prisma.job.findFirst({
    where: {
      id: jobId,
      employerId: session.user.id,
    },
    include: {
      _count: {
        select: {
          applications: true,
        },
      },
    },
  });

  if (!job) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <Link
            href="/employer"
            className="text-sm text-zinc-400 transition hover:text-white"
          >
            ← Powrót do panelu
          </Link>

          <h1 className="mt-5 text-3xl font-bold tracking-tight">
            Edytuj ofertę pracy
          </h1>

          <p className="mt-3 text-zinc-400">
            Zmień dane oferty i zapisz swoje poprawki.
          </p>
        </div>

        {error === "no-changes" && (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <div className="flex items-center gap-2">
              <span className="text-red-400">⚠</span>
              <p className="font-semibold text-red-400">
                Nie wprowadzono żadnych zmian
              </p>
            </div>

            <p className="mt-2 text-sm text-zinc-300">
              Zmień przynajmniej jedno pole oferty, aby ponownie wysłać ją do moderacji.
            </p>
          </div>
        )}

        <form
          action={updateJob}
          className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6"
        >
          <input type="hidden" name="id" value={job.id} />

          <div className="space-y-2">
            <Label htmlFor="title">Stanowisko</Label>
            <Input
              id="title"
              name="title"
              type="text"
              defaultValue={job.title}
              required
              className="border-zinc-700 bg-zinc-950 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Firma</Label>
            <Input
              id="company"
              name="company"
              type="text"
              defaultValue={job.company}
              required
              className="border-zinc-700 bg-zinc-950 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Lokalizacja</Label>
            <Input
              id="location"
              name="location"
              type="text"
              defaultValue={job.location}
              required
              className="border-zinc-700 bg-zinc-950 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Opis stanowiska</Label>
            <textarea
              id="description"
              name="description"
              defaultValue={job.description}
              required
              rows={8}
              className="flex min-h-32 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white shadow-xs outline-none transition-colors placeholder:text-zinc-500 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <Button type="submit">
              Zapisz zmiany
            </Button>

            <Button asChild variant="outline">
              <Link href="/employer">Anuluj</Link>
            </Button>
          </div>
        </form>

        <div className="mt-6 rounded-xl border border-red-900/50 bg-zinc-900/50 p-6">
          <h2 className="mb-3 text-lg font-semibold">
            Strefa niebezpieczna
          </h2>

          <p className="mb-5 text-sm text-zinc-400">
            {job._count.applications > 0
              ? `Ta oferta ma ${job._count.applications} zgłoszeń. Nie można jej trwale usunąć. Możesz ją ukryć w panelu pracodawcy.`
              : "Ta oferta nie ma żadnych zgłoszeń. Możesz ją trwale usunąć."}
          </p>

          {job._count.applications === 0 && (
            <DeleteJobButton id={job.id} />
          )}
        </div>
      </div>
    </main>
  );
}
