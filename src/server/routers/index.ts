// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { workoutRouter } from "./workout";
import { exerciseRouter } from "./exercise";
import { userRouter } from "./user";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("workouts.", workoutRouter)
  .merge("exercises.", exerciseRouter)
  .merge("users.", userRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
