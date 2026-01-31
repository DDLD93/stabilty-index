-- AlterTable
ALTER TABLE "Cycle" ADD COLUMN "surveyQuestions" JSONB;

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN "pillarResponses" JSONB,
ALTER COLUMN "stabilityScore" DROP NOT NULL,
ALTER COLUMN "mood" DROP NOT NULL,
ALTER COLUMN "oneWord" DROP NOT NULL;
