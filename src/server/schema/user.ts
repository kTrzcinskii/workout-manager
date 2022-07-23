import { z } from "zod";

export const getUserInfoInput = z.object({
  userEmail: z.string().email(),
});

export const increaseNumOfDoneWorkoutsInput = z.object({
  workoutId: z.string(),
});
