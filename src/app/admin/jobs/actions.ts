
"use server";

import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleJobVisibility(formData: FormData) {
  await requireAdmin();

  const jobId = Number(formData.get("jobId"));

  if (!Number.isInteger(jobId) || jobId <= 0) {
    throw new Error("Nieprawidłowy identyfikator oferty.");
  }

  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
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
    throw new Error("Można zmieniać widoczność tylko zaakceptowanych ofert.");
  }

  await prisma.job.update({
    where: {
      id: job.id,
    },
    data: {
      isActive: !job.isActive,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/jobs");
  revalidatePath("/employer");
  revalidatePath("/jobs");
  revalidatePath(`/jobs/${job.id}`);
}

export async function approveJob(formData: FormData) {
  await requireAdmin();

  const jobId = Number(formData.get("jobId"));

  if (!Number.isInteger(jobId) || jobId <= 0) {
    throw new Error("Nieprawidłowy identyfikator oferty.");
  }

  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
    select: {
      id: true,
      moderationStatus: true,
    },
  });

  if (!job) {
    throw new Error("Nie znaleziono oferty.");
  }

  if (job.moderationStatus !== "PENDING") {
    throw new Error("Ta oferta nie oczekuje na moderację.");
  }

  await prisma.job.update({
    where: {
      id: job.id,
    },
    data: {
      moderationStatus: "APPROVED",
      moderationReason: null,
      isActive: true,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/jobs");
  revalidatePath("/employer");
  revalidatePath("/jobs");
  revalidatePath(`/jobs/${job.id}`);
}

export async function rejectJob(formData: FormData) {
  await requireAdmin();

  const jobId = Number(formData.get("jobId"));
  const reason = formData.get("reason");

  if (!Number.isInteger(jobId) || jobId <= 0) {
    throw new Error("Nieprawidłowy identyfikator oferty.");
  }

  if (
    typeof reason !== "string" ||
    !reason.trim() ||
    reason.trim().length > 2000
  ) {
    throw new Error("Podaj powód odrzucenia o długości do 2000 znaków.");
  }

  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
    select: {
      id: true,
      moderationStatus: true,
    },
  });

  if (!job) {
    throw new Error("Nie znaleziono oferty.");
  }

  if (job.moderationStatus !== "PENDING") {
    throw new Error("Ta oferta nie oczekuje na moderację.");
  }

  await prisma.job.update({
    where: {
      id: job.id,
    },
    data: {
      moderationStatus: "REJECTED",
      moderationReason: reason.trim(),
      isActive: false,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/jobs");
  revalidatePath("/employer");
  revalidatePath("/jobs");
  revalidatePath(`/jobs/${job.id}`);
}
