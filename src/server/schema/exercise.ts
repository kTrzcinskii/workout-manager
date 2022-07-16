import z from "zod";

export const changeExerciseIndexInput = z.object({
  workoutId: z.string().min(1),
  exerciseId: z.string().min(1),
  newIndex: z.number().min(0),
});

export const deleteExerciseInput = z.object({
  exerciseId: z.string().min(1),
});
