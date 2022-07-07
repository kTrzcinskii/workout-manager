import { z } from "zod";

export const getAllWorkoutsInput = z.object({
  limit: z.number().min(1).max(20),
  page: z.number().min(0),
});
