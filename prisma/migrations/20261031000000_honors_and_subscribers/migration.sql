-- CreateEnum
CREATE TYPE "SubscriberStatus" AS ENUM ('PENDING', 'CONFIRMED', 'UNSUBSCRIBED');

-- CreateEnum
CREATE TYPE "HonorsEditionStatus" AS ENUM ('DRAFT', 'NOMINATIONS_OPEN', 'SHORTLISTING', 'VOTING_OPEN', 'VOTING_CLOSED', 'ANNOUNCED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "HonorsNomineeType" AS ENUM ('PUBLIC_INSTITUTION', 'STATE_OR_LGA', 'ORGANISATION', 'INDIVIDUAL');

-- CreateEnum
CREATE TYPE "HonorsNominationStatus" AS ENUM ('PENDING', 'SHORTLISTED', 'REJECTED', 'DUPLICATE');

-- CreateEnum
CREATE TYPE "HonorsNominatorRelation" AS ENUM ('INDEPENDENT', 'AFFILIATED', 'SELF');

-- CreateTable
CREATE TABLE "Subscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" "SubscriberStatus" NOT NULL DEFAULT 'PENDING',
    "confirmTokenHash" TEXT,
    "confirmTokenExpiresAt" TIMESTAMP(3),
    "unsubscribeToken" TEXT NOT NULL,
    "confirmedAt" TIMESTAMP(3),
    "unsubscribedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HonorsEdition" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "status" "HonorsEditionStatus" NOT NULL DEFAULT 'DRAFT',
    "nominationsOpenAt" TIMESTAMP(3),
    "nominationsCloseAt" TIMESTAMP(3),
    "votingOpenAt" TIMESTAMP(3),
    "votingCloseAt" TIMESTAMP(3),
    "ceremonyAt" TIMESTAMP(3),
    "ceremonyVenue" TEXT,
    "ceremonyDetails" TEXT,
    "showVoteResults" BOOLEAN NOT NULL DEFAULT false,
    "contactsPurgedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HonorsEdition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HonorsCategory" (
    "id" TEXT NOT NULL,
    "editionId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "criteria" TEXT,
    "allowedNomineeTypes" "HonorsNomineeType"[],
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "winnerFinalistId" TEXT,
    "winnerCitation" TEXT,
    "winnerNote" TEXT,
    "winnerPublishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HonorsCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HonorsNomination" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "editionId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "nomineeType" "HonorsNomineeType" NOT NULL,
    "nomineeName" TEXT NOT NULL,
    "nomineeState" TEXT,
    "nomineeLga" TEXT,
    "nomineeAffiliation" TEXT,
    "reason" TEXT NOT NULL,
    "evidenceUrls" TEXT[],
    "nominatorName" TEXT,
    "nominatorEmail" TEXT,
    "nominatorEmailHash" TEXT NOT NULL,
    "nominatorRelation" "HonorsNominatorRelation" NOT NULL,
    "agentId" TEXT,
    "deviceHash" TEXT,
    "ipHash" TEXT,
    "status" "HonorsNominationStatus" NOT NULL DEFAULT 'PENDING',
    "duplicateOfId" TEXT,
    "adminNote" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HonorsNomination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HonorsFinalist" (
    "id" TEXT NOT NULL,
    "editionId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "nominationId" TEXT,
    "displayName" TEXT NOT NULL,
    "nomineeType" "HonorsNomineeType" NOT NULL,
    "state" TEXT,
    "summary" TEXT NOT NULL,
    "imageUrl" TEXT,
    "imageAlt" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HonorsFinalist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HonorsVoteRequest" (
    "id" TEXT NOT NULL,
    "editionId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "emailHash" TEXT NOT NULL,
    "selections" JSONB NOT NULL,
    "deviceHash" TEXT,
    "ipHash" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HonorsVoteRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HonorsVote" (
    "id" TEXT NOT NULL,
    "editionId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "finalistId" TEXT NOT NULL,
    "emailHash" TEXT NOT NULL,
    "deviceHash" TEXT,
    "ipHash" TEXT,
    "requestId" TEXT,
    "isVoid" BOOLEAN NOT NULL DEFAULT false,
    "voidReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HonorsVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_email_key" ON "Subscriber"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_confirmTokenHash_key" ON "Subscriber"("confirmTokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_unsubscribeToken_key" ON "Subscriber"("unsubscribeToken");

-- CreateIndex
CREATE INDEX "Subscriber_status_idx" ON "Subscriber"("status");

-- CreateIndex
CREATE UNIQUE INDEX "HonorsEdition_year_key" ON "HonorsEdition"("year");

-- CreateIndex
CREATE INDEX "HonorsEdition_status_idx" ON "HonorsEdition"("status");

-- CreateIndex
CREATE UNIQUE INDEX "HonorsCategory_winnerFinalistId_key" ON "HonorsCategory"("winnerFinalistId");

-- CreateIndex
CREATE INDEX "HonorsCategory_editionId_sortOrder_idx" ON "HonorsCategory"("editionId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "HonorsCategory_editionId_slug_key" ON "HonorsCategory"("editionId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "HonorsNomination_reference_key" ON "HonorsNomination"("reference");

-- CreateIndex
CREATE INDEX "HonorsNomination_editionId_categoryId_status_idx" ON "HonorsNomination"("editionId", "categoryId", "status");

-- CreateIndex
CREATE INDEX "HonorsNomination_nominatorEmailHash_idx" ON "HonorsNomination"("nominatorEmailHash");

-- CreateIndex
CREATE INDEX "HonorsNomination_ipHash_createdAt_idx" ON "HonorsNomination"("ipHash", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "HonorsFinalist_nominationId_key" ON "HonorsFinalist"("nominationId");

-- CreateIndex
CREATE INDEX "HonorsFinalist_categoryId_isActive_sortOrder_idx" ON "HonorsFinalist"("categoryId", "isActive", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "HonorsVoteRequest_tokenHash_key" ON "HonorsVoteRequest"("tokenHash");

-- CreateIndex
CREATE INDEX "HonorsVoteRequest_emailHash_createdAt_idx" ON "HonorsVoteRequest"("emailHash", "createdAt");

-- CreateIndex
CREATE INDEX "HonorsVoteRequest_ipHash_createdAt_idx" ON "HonorsVoteRequest"("ipHash", "createdAt");

-- CreateIndex
CREATE INDEX "HonorsVoteRequest_deviceHash_createdAt_idx" ON "HonorsVoteRequest"("deviceHash", "createdAt");

-- CreateIndex
CREATE INDEX "HonorsVote_finalistId_isVoid_idx" ON "HonorsVote"("finalistId", "isVoid");

-- CreateIndex
CREATE INDEX "HonorsVote_editionId_ipHash_idx" ON "HonorsVote"("editionId", "ipHash");

-- CreateIndex
CREATE INDEX "HonorsVote_editionId_deviceHash_idx" ON "HonorsVote"("editionId", "deviceHash");

-- CreateIndex
CREATE UNIQUE INDEX "HonorsVote_categoryId_emailHash_key" ON "HonorsVote"("categoryId", "emailHash");

-- AddForeignKey
ALTER TABLE "HonorsCategory" ADD CONSTRAINT "HonorsCategory_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "HonorsEdition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HonorsCategory" ADD CONSTRAINT "HonorsCategory_winnerFinalistId_fkey" FOREIGN KEY ("winnerFinalistId") REFERENCES "HonorsFinalist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HonorsNomination" ADD CONSTRAINT "HonorsNomination_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "HonorsEdition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HonorsNomination" ADD CONSTRAINT "HonorsNomination_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "HonorsCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HonorsNomination" ADD CONSTRAINT "HonorsNomination_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HonorsFinalist" ADD CONSTRAINT "HonorsFinalist_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "HonorsEdition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HonorsFinalist" ADD CONSTRAINT "HonorsFinalist_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "HonorsCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HonorsFinalist" ADD CONSTRAINT "HonorsFinalist_nominationId_fkey" FOREIGN KEY ("nominationId") REFERENCES "HonorsNomination"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HonorsVoteRequest" ADD CONSTRAINT "HonorsVoteRequest_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "HonorsEdition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HonorsVote" ADD CONSTRAINT "HonorsVote_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "HonorsEdition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HonorsVote" ADD CONSTRAINT "HonorsVote_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "HonorsCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HonorsVote" ADD CONSTRAINT "HonorsVote_finalistId_fkey" FOREIGN KEY ("finalistId") REFERENCES "HonorsFinalist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

