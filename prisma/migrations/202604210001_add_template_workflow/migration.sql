-- AlterTable
ALTER TABLE "Template" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'APPROVED';
ALTER TABLE "Template" ADD COLUMN "createdBy" TEXT;
ALTER TABLE "Template" ADD COLUMN "scoringRules" TEXT;
