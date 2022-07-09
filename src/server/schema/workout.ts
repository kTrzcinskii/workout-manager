import z from "zod";

export const getAllWorkoutsInput = z.object({
  limit: z.number().min(1).max(20),
  page: z.number().min(0),
  title: z.string().optional(),
});

export const getSingleWorkoutInput = z.object({
  id: z.string(),
});

export const createExerciseInput = z.object({
  title: z.string().min(1, "Title is required"),
  series: z.number().min(1).or(z.string().min(1, "Series are required")),
  repsInOneSeries: z
    .number()
    .min(1)
    .or(z.string().min(1, "Reps in one series are required")),
  index: z.number().min(0).or(z.string().min(1, "Index is required")),
  weight: z.number().optional().or(z.string().optional()),
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

export const deleteWorkoutInput = z.object({
  workoutId: z.string().min(1),
});
