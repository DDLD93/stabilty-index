-- AlterTable
ALTER TABLE "Snapshot" ADD COLUMN     "streetPulseSpotlightContent" JSONB;

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "agentId" TEXT,
ADD COLUMN     "deviceInfo" JSONB;

-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "referrerCode" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Agent_email_key" ON "Agent"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_referrerCode_key" ON "Agent"("referrerCode");

-- CreateIndex
CREATE INDEX "Submission_agentId_idx" ON "Submission"("agentId");

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

