import z from "zod";

export const getAllWorkoutsInput = z.object({
  limit: z.number().min(1).max(20),
  page: z.number().min(0),
});

export const getSingleWorkoutInput = z.object({
  id: z.string(),
});

export const createExerciseInput = z.object({
  title: z.string().min(1, "Title is required"),
  series: z.number().min(1),
  repsInOneSeries: z.number().min(1),
  weight: z.number().optional(),
});

export type createExerciseSchema = z.TypeOf<typeof createExerciseInput>;

export const createWorkoutInput = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  breakDuration: z
    .number()
    .min(0)
    .or(z.string().min(1, "Break Duration is required")),
  exercises: z.array(createExerciseInput).min(1),
});

export type createWorkoutSchema = z.TypeOf<typeof createWorkoutInput>;
