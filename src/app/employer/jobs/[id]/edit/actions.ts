"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updateJob(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "EMPLOYER") {
    redirect("/");
  }

  const id = Number(formData.get("id"));
  const title = formData.get("title");
  const company = formData.get("company");
  const location = formData.get("location");
  const description = formData.get("description");

  if (
    !Number.isInteger(id) ||
    id <= 0 ||
    typeof title !== "string" ||
    typeof company !== "string" ||
    typeof location !== "string" ||
    typeof description !== "string" ||
    !title.trim() ||
    !company.trim() ||
    !location.trim() ||
    !description.trim()
  ) {
    throw new Error("Uzupełnij poprawnie wszystkie pola.");
  }

  const job = await prisma.job.findFirst({
    where: {
      id,
      employerId: session.user.id,
    },
    select: {
      id: true,
      title: true,
      company: true,
      location: true,
      description: true,
      moderationStatus: true,
    },
  });

  if (!job) {
    throw new Error("Nie znaleziono oferty lub nie masz do niej dostępu.");
  }

  const updatedTitle = title.trim();
  const updatedCompany = company.trim();
  const updatedLocation = location.trim();
  const updatedDescription = description.trim();

  const hasChanges =
    job.title !== updatedTitle ||
    job.company !== updatedCompany ||
    job.location !== updatedLocation ||
    job.description !== updatedDescription;

  if (job.moderationStatus === "REJECTED" && !hasChanges) {
  redirect(`/employer/jobs/${id}/edit?error=no-changes`);
}

  await prisma.job.update({
    where: {
      id: job.id,
    },
    data: {
      title: updatedTitle,
      company: updatedCompany,
      location: updatedLocation,
      description: updatedDescription,
      ...(job.moderationStatus === "REJECTED"
        ? {
            moderationStatus: "PENDING",
            moderationReason: null,
            isActive: false,
          }
        : {}),
    },
  });

  revalidatePath("/employer");
  revalidatePath("/jobs");
  revalidatePath(`/jobs/${id}`);

  redirect("/employer");
}

export async function deleteJob(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "EMPLOYER") {
    redirect("/");
  }

  const id = Number(formData.get("id"));

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Nieprawidłowy identyfikator oferty.");
  }

  await prisma.$transaction(async (tx) => {
    const job = await tx.job.findFirst({
      where: {
        id,
        employerId: session.user.id,
      },
      select: {
        id: true,
      },
    });

    if (!job) {
      throw new Error("Nie znaleziono oferty lub nie masz do niej dostępu.");
    }

    const applicationsCount = await tx.application.count({
      where: {
        jobId: id,
      },
    });

    if (applicationsCount > 0) {
      throw new Error(
        "Nie można usunąć oferty, która posiada zgłoszenia. Możesz ją ukryć."
      );
    }

    await tx.job.delete({
      where: {
        id,
      },
    });
  });

  revalidatePath("/employer");
  revalidatePath("/jobs");
  revalidatePath("/saved-jobs");

  redirect("/employer");
}
export async function toggleJobVisibility(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "EMPLOYER") {
    redirect("/");
  }

  const id = Number(formData.get("id"));

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Nieprawidłowy identyfikator oferty.");
  }

  const job = await prisma.job.findFirst({
    where: {
      id,
      employerId: session.user.id,
    },
    select: {
      id: true,
      isActive: true,
      moderationStatus: true,
    },
  });

  if (!job) {
    throw new Error("Nie znaleziono oferty.");
  }

  if (job.moderationStatus !== "APPROVED") {
    throw new Error(
      "Nie można zmienić widoczności oferty, która nie została zaakceptowana przez administratora."
    );
  }

  await prisma.job.update({
    where: {
      id: job.id,
    },
    data: {
      isActive: !job.isActive,
    },
  });

  revalidatePath("/employer");
  revalidatePath("/jobs");
  revalidatePath(`/jobs/${id}`);

  redirect("/employer");
}