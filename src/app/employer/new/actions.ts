"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createJob(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "EMPLOYER") {
    redirect("/");
  }

  const title = formData.get("title");
  const company = formData.get("company");
  const location = formData.get("location");
  const description = formData.get("description");

  if (
    typeof title !== "string" ||
    typeof company !== "string" ||
    typeof location !== "string" ||
    typeof description !== "string" ||
    !title.trim() ||
    !company.trim() ||
    !location.trim() ||
    !description.trim()
  ) {
    throw new Error("Wszystkie pola są wymagane.");
  }

  await prisma.job.create({
    data: {
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      description: description.trim(),
      employerId: session.user.id,
    },
  });

  redirect("/employer");
}