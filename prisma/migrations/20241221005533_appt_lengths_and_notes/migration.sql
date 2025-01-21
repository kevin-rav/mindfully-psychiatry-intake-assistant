-- AlterTable
ALTER TABLE "Psychiatrist" ADD COLUMN     "followUpApptLength" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "initialApptLength" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "notes" TEXT NOT NULL DEFAULT '';
