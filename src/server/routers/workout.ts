import { TRPCError } from "@trpc/server";
import { getAllWorkoutsInput } from "../schema/workout";
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

      const responseWorkouts = workouts.map(async (workout) => {
        const numberOfExs = await ctx.prisma.exercise.count({
          where: { workoutId: workout.id },
        });

        return { ...workout, numberOfExs };
      });

      return { workouts: responseWorkouts, hasMore };
    },
  });
