import { TRPCError } from "@trpc/server";
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
    async resolve({ ctx }) {
      const userEmail = ctx.session?.user?.email;
      if (!userEmail) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const workouts = await ctx.prisma.workout.findMany({
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

      const responseWorkouts = workouts.map(async (workout) => {
        const numberOfExs = await ctx.prisma.exercise.count({
          where: { workoutId: workout.id },
        });

        return { ...workout, numberOfExs };
      });

      return responseWorkouts;
    },
  });
