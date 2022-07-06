// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { workoutRouter } from "./workout";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("workouts.", workoutRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
