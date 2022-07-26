import { TRPCError } from "@trpc/server";
import {
  addExerciseInput,
  changeExerciseIndexInput,
  deleteExerciseInput,
  editExerciseInput,
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

      await ctx.prisma.exercise.updateMany({
        where: { workoutId: exercise.workoutId, index: { gt: exercise.index } },
        data: {
          index: {
            decrement: 1,
          },
        },
      });

      await ctx.prisma.exercise.delete({ where: { id: input.exerciseId } });

      return { successful: true };
    },
  })
  .mutation("edit-exercise", {
    input: editExerciseInput,
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

      const dataForNewExercise = {
        title: input.title,
        weight: input.weight ? Number(input.weight) : null,
        series: Number(input.series),
        repsInOneSeries: Number(input.repsInOneSeries),
      };

      await ctx.prisma.exercise.update({
        where: { id: input.exerciseId },
        data: { ...dataForNewExercise },
      });

      return { successful: true };
    },
  })
  .mutation("add-exercise-to-existing-project", {
    input: addExerciseInput,
    async resolve({ ctx, input }) {
      const userEmail = ctx.session?.user?.email!;

      const workout = await ctx.prisma.workout.findUnique({
        where: { id: input.workoutId },
        include: { user: true },
      });

      if (!workout || workout.user.email !== userEmail) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const data = {
        title: input.title,
        weight: input.weight ? Number(input.weight) : null,
        series: Number(input.series),
        repsInOneSeries: Number(input.repsInOneSeries),
        index: Number(input.index),
      };

      await ctx.prisma.exercise.create({
        data: { workout: { connect: { id: input.workoutId } }, ...data },
      });

      return { successful: true };
    },
  });
