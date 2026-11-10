-- CreateEnum
CREATE TYPE "JobCategory" AS ENUM ('IT', 'FINANCE', 'MARKETING', 'LOGISTICS', 'ADMINISTRATION', 'ENGINEERING', 'OTHER');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'MANDATE', 'INTERNSHIP');

-- CreateEnum
CREATE TYPE "WorkMode" AS ENUM ('REMOTE', 'HYBRID', 'OFFICE');

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "category" "JobCategory" NOT NULL DEFAULT 'OTHER',
ADD COLUMN     "employmentType" "EmploymentType" NOT NULL DEFAULT 'FULL_TIME',
ADD COLUMN     "workMode" "WorkMode" NOT NULL DEFAULT 'OFFICE';
