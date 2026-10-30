
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { updateJob } from "./actions";
import DeleteJobButton from "./delete-job-button";

type EditJobPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditJobPage({ params }: EditJobPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "EMPLOYER") {
    redirect("/");
  }

  const { id } = await params;
  const jobId = Number(id);

  if (!Number.isInteger(jobId) || jobId <= 0) {
    notFound();
  }

  const job = await prisma.job.findFirst({
    where: {
      id: jobId,
      employerId: session.user.id,
    },
  });

  if (!job) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold">Edytuj ofertę pracy</h1>

        <p className="mt-3 text-zinc-400">
          Zmień dane oferty i zapisz swoje poprawki.
        </p>

        <form action={updateJob} className="mt-8 space-y-5">
          <input type="hidden" name="id" value={job.id} />

          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-medium">
              Stanowisko
            </label>
            <input
              id="title"
              name="title"
              type="text"
              defaultValue={job.title}
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="company" className="mb-2 block text-sm font-medium">
              Firma
            </label>
            <input
              id="company"
              name="company"
              type="text"
              defaultValue={job.company}
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="location" className="mb-2 block text-sm font-medium">
              Lokalizacja
            </label>
            <input
              id="location"
              name="location"
              type="text"
              defaultValue={job.location}
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium"
            >
              Opis stanowiska
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={job.description}
              required
              rows={8}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          
<div className="flex flex-wrap gap-3">
  <button
    type="submit"
    className="rounded-lg bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500"
  >
    Zapisz zmiany
  </button>

  <a
    href="/employer"
    className="rounded-lg border border-zinc-700 px-5 py-3 font-medium hover:bg-zinc-800"
  >
    Anuluj
  </a>
</div>

        </form>

        <div className="mt-5 border-t border-zinc-800 pt-5">
          <DeleteJobButton id={job.id} />
        </div>
      </div>
    </main>
  );
}
