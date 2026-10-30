
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "CANDIDATE") {
    redirect("/jobs");
  }

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!name) {
    redirect("/profile?error=name");
  }

  if (name.length > 100 || phone.length > 30 || description.length > 3000) {
    redirect("/profile?error=length");
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      name,
      phone: phone || null,
      description: description || null,
    },
  });

  redirect("/profile?saved=1");
}
