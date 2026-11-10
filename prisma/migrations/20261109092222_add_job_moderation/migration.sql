-- CreateEnum
CREATE TYPE "JobModerationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "moderationReason" TEXT,
ADD COLUMN     "moderationStatus" "JobModerationStatus" NOT NULL DEFAULT 'APPROVED';
