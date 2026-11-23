
"use server";

import { requireEmployer } from "@/lib/employer";
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
  const user = await requireEmployer();
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
        employerId: user.id,
      },
    },
    select: {
      id: true,
      candidateId: true,
      status: true,
      job: {
        select: {
          title: true,
        },
      },
    },
  });

  if (!application) {
    return { error: "Nie znaleziono zgłoszenia." };
  }

  const newStatus = status as ApplicationStatus;

  if (application.status !== newStatus) {
    await prisma.$transaction(async (tx) => {
      await tx.application.update({
        where: {
          id: application.id,
        },
        data: {
          status: newStatus,
        },
      });

      if (newStatus === "ACCEPTED" || newStatus === "REJECTED") {
        await tx.notification.create({
          data: {
            userId: application.candidateId,
            title: "Zmiana statusu zgłoszenia",
            message:
              newStatus === "ACCEPTED"
                ? `Twoje zgłoszenie na stanowisko ${application.job.title} zostało zaakceptowane.`
                : `Twoje zgłoszenie na stanowisko ${application.job.title} zostało odrzucone.`,
          },
        });
      }
    });
  }

  revalidatePath(`/employer/jobs/${jobId}/applications`);
  redirect(`/employer/jobs/${jobId}/applications`);
}
