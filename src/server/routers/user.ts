import { Workout } from ".prisma/client";
import { TRPCError } from "@trpc/server";
import {
  getUserInfoInput,
  increaseNumOfDoneWorkoutsInput,
} from "../schema/user";
import { createRouter } from "./context";

interface WorkoutInfo {
  workoutId: string | null;
  name: string | null;
}

export const userRouter = createRouter()
  .middleware(
    //after this middleware every routre is protected
    async ({ ctx, next }) => {
      if (!ctx.session) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return next();
    }
  )
  .query("get-user-info", {
    input: getUserInfoInput,
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.findUnique({
        where: { email: input.userEmail },
        select: {
          name: true,
          email: true,
          image: true,
          favoriteWorkout: true,
          lastDoneWorkout: true,
          numOfDoneWorkouts: true,
          workouts: true,
        },
      });
      const sessionEmail = ctx.session!.user!.email!;
      if (user?.email !== sessionEmail || !user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      let favWorkout: { title: string } | null = null;
      if (user.favoriteWorkout) {
        favWorkout = await ctx.prisma.workout.findUnique({
          where: { id: user.favoriteWorkout },
          select: { title: true },
        });
      }

      let lastDoneWorkout: { title: string } | null = null;
      if (user.lastDoneWorkout) {
        lastDoneWorkout = await ctx.prisma.workout.findUnique({
          where: { id: user.lastDoneWorkout },
          select: { title: true },
        });
      }

      const numOfWorkouts = user.workouts.length;
      const userReturn: {
        name: string | null;
        email: string | null;
        image: string | null;
        favoriteWorkout: WorkoutInfo;
        lastDoneWorkout: WorkoutInfo;
        numOfDoneWorkouts: number;
        workouts?: Workout[];
        numOfWorkouts: number;
      } = {
        ...user,
        favoriteWorkout: {
          workoutId: user.favoriteWorkout,
          name: favWorkout?.title || null,
        },
        lastDoneWorkout: {
          workoutId: user.lastDoneWorkout,
          name: lastDoneWorkout?.title || null,
        },
        numOfWorkouts,
      };

      delete userReturn.workouts;

      return userReturn;
    },
  })
  .mutation("increase-num-of-done-workouts", {
    input: increaseNumOfDoneWorkoutsInput,
    async resolve({ ctx, input }) {
      const userEmail = ctx.session!.user!.email!;

      const workoutToUpdate = await ctx.prisma.workout.findUnique({
        where: {
          id: input.workoutId,
        },
        include: { user: true },
      });

      if (!workoutToUpdate || workoutToUpdate.user.email !== userEmail) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      let favWorkout: Workout | null = null;
      if (workoutToUpdate.user.favoriteWorkout) {
        favWorkout = await ctx.prisma.workout.findUnique({
          where: {
            id: workoutToUpdate.user.favoriteWorkout,
          },
        });
      }

      let newFavWorkout = favWorkout?.id;

      if (
        !favWorkout ||
        favWorkout.numOfDones < workoutToUpdate.numOfDones + 1
      ) {
        newFavWorkout = workoutToUpdate.id;
      }

      await ctx.prisma.user.update({
        where: {
          email: userEmail,
        },
        data: {
          numOfDoneWorkouts: {
            increment: 1,
          },
          lastDoneWorkout: input.workoutId,
          favoriteWorkout: newFavWorkout,
        },
      });

      await ctx.prisma.workout.update({
        where: { id: input.workoutId },
        data: {
          numOfDones: {
            increment: 1,
          },
        },
      });

      return { successful: true };
    },
  });
