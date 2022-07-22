import { Workout } from ".prisma/client";
import { TRPCError } from "@trpc/server";
import { getUserInfoInput } from "../schema/user";
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
  });
