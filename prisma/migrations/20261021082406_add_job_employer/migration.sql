-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "employerId" TEXT;

-- CreateIndex
CREATE INDEX "Job_employerId_idx" ON "Job"("employerId");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
