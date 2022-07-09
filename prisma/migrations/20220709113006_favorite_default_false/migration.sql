/*
  Warnings:

  - Made the column `favorite` on table `Workout` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Workout" ALTER COLUMN "favorite" SET NOT NULL,
ALTER COLUMN "favorite" SET DEFAULT false;
