
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ApplicationStatus } from "@/generated/prisma/enums";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

type ActionState = {
  error?: string;
} | null;

export async function updateApplicationStatus(
  applicationId: number,
  jobId: number,
  _previousState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "EMPLOYER") {
    return { error: "Brak uprawnień." };
  }

  const status = formData.get("status");

  if (
    typeof status !== "string" ||
    !["PENDING", "ACCEPTED", "REJECTED"].includes(status)
  ) {
    return { error: "Nieprawidłowy status." };
  }

  const application = await prisma.application.findFirst({
    where: {
      id: applicationId,
      jobId,
      job: {
        employerId: session.user.id,
      },
    },
    select: {
      id: true,
    },
  });

  if (!application) {
    return { error: "Nie znaleziono zgłoszenia." };
  }

  await prisma.application.update({
    where: {
      id: application.id,
    },
    data: {
      status: status as ApplicationStatus,
    },
  });

  revalidatePath(`/employer/jobs/${jobId}/applications`);
  redirect(`/employer/jobs/${jobId}/applications`);
}
