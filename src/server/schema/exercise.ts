import z from "zod";

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

export const changeExerciseIndexInput = z.object({
  workoutId: z.string().min(1),
  exerciseId: z.string().min(1),
  newIndex: z.number().min(0),
});

export const deleteExerciseInput = z.object({
  exerciseId: z.string().min(1),
});
