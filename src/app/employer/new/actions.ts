
"use server";

import { requireEmployer } from "@/lib/employer";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  JobCategory,
  EmploymentType,
  WorkMode,
} from "@/generated/prisma/client";

const allowedCurrencies = [
  "PLN",
  "EUR",
  "USD",
  "GBP",
  "CHF",
  "CZK",
  "SEK",
  "NOK",
  "DKK",
];
function generateSlug(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
export async function createJob(formData: FormData) {
  const user = await requireEmployer();

  const title = formData.get("title");
  const company = formData.get("company");
  const location = formData.get("location");
  const description = formData.get("description");
  const category = formData.get("category");
  const employmentType = formData.get("employmentType");
  const workMode = formData.get("workMode");
  const salaryMinValue = formData.get("salaryMin");
  const salaryMaxValue = formData.get("salaryMax");
  const salaryCurrencyValue = formData.get("salaryCurrency");

  if (
    typeof title !== "string" ||
    typeof company !== "string" ||
    typeof location !== "string" ||
    typeof description !== "string" ||
    typeof category !== "string" ||
    typeof employmentType !== "string" ||
    typeof workMode !== "string" ||
    typeof salaryMinValue !== "string" ||
    typeof salaryMaxValue !== "string" ||
    typeof salaryCurrencyValue !== "string" ||
    !title.trim() ||
    !company.trim() ||
    !location.trim() ||
    !description.trim()
  ) {
    throw new Error("Wszystkie wymagane pola muszą być uzupełnione.");
  }

  if (
    !Object.values(JobCategory).includes(category as JobCategory) ||
    !Object.values(EmploymentType).includes(
      employmentType as EmploymentType,
    ) ||
    !Object.values(WorkMode).includes(workMode as WorkMode)
  ) {
    throw new Error("Nieprawidłowe wartości kategorii lub trybu pracy.");
  }

  const hasSalaryMin = salaryMinValue.trim() !== "";
  const hasSalaryMax = salaryMaxValue.trim() !== "";

  if (hasSalaryMin !== hasSalaryMax) {
    throw new Error(
      "Podaj zarówno minimalne, jak i maksymalne wynagrodzenie.",
    );
  }

  let salaryMin: number | null = null;
  let salaryMax: number | null = null;
  let salaryCurrency: string | null = null;

  if (hasSalaryMin && hasSalaryMax) {
    salaryMin = Number(salaryMinValue);
    salaryMax = Number(salaryMaxValue);

    if (
      !Number.isSafeInteger(salaryMin) ||
      !Number.isSafeInteger(salaryMax) ||
      salaryMin <= 0 ||
      salaryMax <= 0
    ) {
      throw new Error("Wynagrodzenie musi być dodatnią liczbą całkowitą.");
    }

    if (salaryMax < salaryMin) {
      throw new Error(
        "Maksymalne wynagrodzenie nie może być niższe od minimalnego.",
      );
    }

    if (!allowedCurrencies.includes(salaryCurrencyValue)) {
      throw new Error("Nieprawidłowa waluta wynagrodzenia.");
    }

    salaryCurrency = salaryCurrencyValue;
  }

  const job = await prisma.job.create({
  data: {
    title: title.trim(),
    company: company.trim(),
    location: location.trim(),
    description: description.trim(),
    category: category as JobCategory,
    employmentType: employmentType as EmploymentType,
    workMode: workMode as WorkMode,
    salaryMin,
    salaryMax,
    salaryCurrency,
    employerId: user.id,
    isActive: false,
    moderationStatus: "PENDING",
    moderationReason: null,
  },
});

await prisma.job.update({
  where: { id: job.id },
  data: {
    slug: `${generateSlug(title)}-${job.id}`,
  },
});

  redirect("/employer");
}
