
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Brak DATABASE_URL w pliku .env");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const job = await prisma.job.create({
    data: {
      title: "Junior Data Analyst",
      company: "DevJobs Demo",
      location: "Warszawa",
      description:
        "Szukamy osoby rozpoczynającej karierę w analizie danych. Mile widziana znajomość SQL i Excela.",
    },
  });

  console.log("Dodano ofertę:", job);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

