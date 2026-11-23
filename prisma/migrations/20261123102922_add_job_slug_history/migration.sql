-- CreateTable
CREATE TABLE "JobSlugHistory" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "jobId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobSlugHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobSlugHistory_slug_key" ON "JobSlugHistory"("slug");

-- CreateIndex
CREATE INDEX "JobSlugHistory_jobId_idx" ON "JobSlugHistory"("jobId");

-- AddForeignKey
ALTER TABLE "JobSlugHistory" ADD CONSTRAINT "JobSlugHistory_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
