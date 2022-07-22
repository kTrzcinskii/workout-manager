import { z } from "zod";

export const getUserInfoInput = z.object({
  userEmail: z.string().email(),
});
