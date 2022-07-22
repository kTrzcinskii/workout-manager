import { z } from "zod";

export const getUserInfoInput = z.object({
  userEmail: z.string().email(),
});

export const setLastDoneWorkoutInput = z.object({
  workoutId: z.string().min(1),
});
