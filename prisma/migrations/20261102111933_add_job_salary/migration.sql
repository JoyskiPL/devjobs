-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "salaryCurrency" VARCHAR(3),
ADD COLUMN     "salaryMax" INTEGER,
ADD COLUMN     "salaryMin" INTEGER;
