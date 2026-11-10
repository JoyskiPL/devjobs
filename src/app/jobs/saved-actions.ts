
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function toggleSavedJob(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "CANDIDATE") {
    redirect("/");
  }

  const jobId = Number(formData.get("jobId"));

  if (!Number.isInteger(jobId) || jobId <= 0) {
    redirect("/jobs");
  }

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: {
      id: true,
      isActive: true,
    },
  });

  if (!job || !job.isActive) {
    redirect("/jobs");
  }

  const existingSavedJob = await prisma.savedJob.findUnique({
    where: {
      userId_jobId: {
        userId: session.user.id,
        jobId,
      },
    },
  });

  if (existingSavedJob) {
    await prisma.savedJob.delete({
      where: {
        userId_jobId: {
          userId: session.user.id,
          jobId,
        },
      },
    });
  } else {
    await prisma.savedJob.create({
      data: {
        userId: session.user.id,
        jobId,
      },
    });
  }

  revalidatePath("/jobs");
  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/saved-jobs");

  redirect(`/jobs/${jobId}`);
}

export async function removeSavedJob(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "CANDIDATE") {
    redirect("/");
  }

  const jobId = Number(formData.get("jobId"));

  if (!Number.isInteger(jobId) || jobId <= 0) {
    redirect("/saved-jobs");
  }

  await prisma.savedJob.deleteMany({
    where: {
      userId: session.user.id,
      jobId,
    },
  });

  revalidatePath("/saved-jobs");
  revalidatePath("/jobs");
  revalidatePath(`/jobs/${jobId}`);

  redirect("/saved-jobs");
}
