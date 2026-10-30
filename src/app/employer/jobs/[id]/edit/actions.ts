
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

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

  const result = await prisma.job.updateMany({
    where: {
      id,
      employerId: session.user.id,
    },
    data: {
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      description: description.trim(),
    },
  });

  if (result.count === 0) {
    throw new Error("Nie znaleziono oferty lub nie masz do niej dostępu.");
  }

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

  const result = await prisma.job.deleteMany({
    where: {
      id,
      employerId: session.user.id,
    },
  });

  if (result.count === 0) {
    throw new Error("Nie znaleziono oferty lub nie masz do niej dostępu.");
  }

  redirect("/employer");
}
