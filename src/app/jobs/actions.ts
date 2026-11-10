
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function applyToJob(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "CANDIDATE") {
    redirect("/");
  }

  const jobId = Number(formData.get("jobId"));

  if (!Number.isInteger(jobId) || jobId <= 0) {
    throw new Error("Nieprawidłowa oferta pracy.");
  }

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: {
      id: true,
      isActive: true,
    },
  });

  if (!job || !job.isActive) {
    throw new Error("Ta oferta pracy jest niedostępna.");
  }

  try {
    await prisma.application.create({
      data: {
        candidateId: session.user.id,
        jobId,
      },
    });
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      redirect(`/jobs/${jobId}?error=already-applied`);
    }

    throw error;
  }

  redirect("/my-applications");
}
