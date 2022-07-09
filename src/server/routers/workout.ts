import { TRPCError } from "@trpc/server";
import {
  createWorkoutInput,
  getAllWorkoutsInput,
  getSingleWorkoutInput,
} from "../schema/workout";
import { createRouter } from "./context";

export const workoutRouter = createRouter()
  .middleware(
    //after this middleware every routre is protected
    async ({ ctx, next }) => {
      if (!ctx.session) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return next();
    }
  )
  .query("get-all-workouts", {
    input: getAllWorkoutsInput,
    async resolve({ ctx, input }) {
      const userEmail = ctx.session?.user?.email;
      if (!userEmail) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const { limit, page } = input;
      const workouts = await ctx.prisma.workout.findMany({
        skip: limit * page,
        take: limit + 1,
        where: {
          user: {
            email: userEmail,
          },
        },
        select: {
          id: true,
          createdAt: true,
          title: true,
          favorite: true,
        },
      });

      let hasMore = false;
      if (workouts.length > limit) {
        (hasMore = true), workouts.pop();
      }

      return { workouts, hasMore };
    },
  })
  .query("get-single-workout", {
    input: getSingleWorkoutInput,
    async resolve({ ctx, input }) {
      const userEmail = ctx.session?.user?.email;
      if (!userEmail) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const workoutId = input.id;

      const workout = await ctx.prisma.workout.findUnique({
        where: { id: workoutId },
      });
      const user = await ctx.prisma.user.findFirst({
        where: { workouts: { some: { id: workoutId } } },
      });

      if (user?.email !== userEmail || !workout) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return workout;
    },
  })
  .mutation("create-workout", {
    input: createWorkoutInput,
    async resolve({ ctx, input }) {
      const { title, description, exercises } = input;
      const breakDuration = Number(input.breakDuration);
      const userEmail = ctx.session?.user?.email;
      if (!userEmail) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const transformedExercises = exercises.map((exercise) => {
        const { title } = exercise;
        const weight = exercise.weight ? Number(exercise.weight) : undefined;
        const series = Number(exercise.series);
        const repsInOneSeries = Number(exercise.repsInOneSeries);
        return { title, weight, series, repsInOneSeries };
      });

      const newWorkout = await ctx.prisma.workout.create({
        data: {
          breakDuration,
          title,
          description,
          exercises: { createMany: { data: [...transformedExercises] } },
          user: {
            connect: {
              email: userEmail,
            },
          },
        },
      });

      if (!newWorkout) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      return { successful: true, workoutId: newWorkout.id };
    },
  });
