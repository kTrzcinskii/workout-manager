-- AlterTable
ALTER TABLE "User" ADD COLUMN     "favoriteWorkout" TEXT,
ADD COLUMN     "lastDoneWorkout" TEXT,
ADD COLUMN     "numOfDoneWorkouts" INTEGER NOT NULL DEFAULT 0;
