import { TRPCError } from "@trpc/server";
import {
  changeExerciseIndexInput,
  deleteExerciseInput,
} from "../schema/exercise";
import { createRouter } from "./context";

export const exerciseRouter = createRouter()
  .middleware(
    //after this middleware every routre is protected
    async ({ ctx, next }) => {
      if (!ctx.session) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return next();
    }
  )
  .mutation("change-index", {
    input: changeExerciseIndexInput,
    async resolve({ ctx, input }) {
      const userEmail = ctx.session?.user?.email!;

      const exercise = await ctx.prisma.exercise.findUnique({
        where: { id: input.exerciseId },
      });
      const workout = await ctx.prisma.workout.findUnique({
        where: { id: input.workoutId },
        include: {
          exercises: {
            where: {
              OR: [{ id: input.exerciseId }, { index: input.newIndex }],
            },
          },
          user: true,
        },
      });
      const exerciseToSwapIndex = await ctx.prisma.exercise.findFirst({
        where: {
          index: input.newIndex,
          workoutId: input.workoutId,
        },
      });

      if (
        !workout ||
        !exercise ||
        !exerciseToSwapIndex ||
        workout.exercises.length !== 2 ||
        workout.user.email !== userEmail
      ) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await ctx.prisma.exercise.update({
        where: { id: exerciseToSwapIndex.id },
        data: {
          index: exercise.index,
        },
      });
      await ctx.prisma.exercise.update({
        where: { id: input.exerciseId },
        data: {
          index: input.newIndex,
        },
      });

      return { sueccessful: true };
    },
  })
  .mutation("delete-exercise", {
    input: deleteExerciseInput,
    async resolve({ ctx, input }) {
      const userEmail = ctx.session?.user?.email!;

      const exercise = await ctx.prisma.exercise.findUnique({
        where: { id: input.exerciseId },
        include: {
          workout: {
            include: { user: true },
          },
        },
      });

      if (!exercise || exercise.workout.user.email !== userEmail) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await ctx.prisma.exercise.delete({ where: { id: input.exerciseId } });

      return { successful: true };
    },
  });
