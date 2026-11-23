
"use server";

import { requireEmployer } from "@/lib/employer";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function generateSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getOptionalUrl(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  const url = value.trim();

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      throw new Error();
    }

    return url;
  } catch {
    throw new Error("Podany adres URL jest nieprawidłowy.");
  }
}

export async function saveCompany(formData: FormData) {
  const user = await requireEmployer();

  const name = formData.get("name");
  const description = formData.get("description");
  const nip = formData.get("nip");
  const location = formData.get("location");

  if (typeof name !== "string" || !name.trim()) {
    throw new Error("Nazwa firmy jest wymagana.");
  }

  if (
    typeof description !== "string" ||
    typeof nip !== "string" ||
    typeof location !== "string"
  ) {
    throw new Error("Nieprawidłowe dane formularza.");
  }

  const cleanName = name.trim();
  const cleanDescription = description.trim();
  const cleanNip = nip.trim().replace(/[\s-]/g, "");
  const cleanLocation = location.trim();

  if (cleanNip && !/^\d{10}$/.test(cleanNip)) {
    throw new Error("NIP musi składać się z 10 cyfr.");
  }

  const websiteValue = formData.get("website");

    const website =
    typeof websiteValue === "string" && websiteValue.trim()
        ? getOptionalUrl(`https://${websiteValue.trim().replace(/^https?:\/\//, "")}`)
        : null;

const logoUrl = getOptionalUrl(formData.get("logoUrl"));

  const existingCompany = await prisma.company.findUnique({
    where: {
      ownerId: user.id,
    },
  });

  const slug = existingCompany
    ? existingCompany.slug
    : `${generateSlug(cleanName) || "firma"}-${user.id.slice(-6)}`;

  await prisma.company.upsert({
    where: {
      ownerId: user.id,
    },
    create: {
      name: cleanName,
      slug,
      description: cleanDescription || null,
      nip: cleanNip || null,
      location: cleanLocation || null,
      website,
      logoUrl,
      ownerId: user.id,
    },
    update: {
      name: cleanName,
      description: cleanDescription || null,
      nip: cleanNip || null,
      location: cleanLocation || null,
      website,
      logoUrl,
    },
  });

  revalidatePath("/employer/company");
  revalidatePath("/employer");

  redirect("/employer");
}
