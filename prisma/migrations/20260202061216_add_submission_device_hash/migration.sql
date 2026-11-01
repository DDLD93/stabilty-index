-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "deviceHash" TEXT;

-- CreateIndex
CREATE INDEX "Submission_cycleId_deviceHash_idx" ON "Submission"("cycleId", "deviceHash");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_cycleId_deviceHash_key" ON "Submission"("cycleId", "deviceHash");

