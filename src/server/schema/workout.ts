import z from "zod";

export const getAllWorkoutsInput = z.object({
  limit: z.number().min(1).max(20),
  page: z.number().min(0),
});

export const getSingleWorkoutInput = z.object({
  id: z.string(),
});

export const createExerciseInput = z.object({
  title: z.string(),
  series: z.number(),
  repsInOneSeries: z.number(),
  weight: z.number().optional(),
});

export type createExerciseSchema = z.TypeOf<typeof createExerciseInput>;

export const createWorkoutInput = z.object({
  title: z.string(),
  description: z.string(),
  breakDuration: z.number().min(0),
  exercises: z.array(createExerciseInput),
});

export type createWorkoutSchema = z.TypeOf<typeof createWorkoutInput>;
