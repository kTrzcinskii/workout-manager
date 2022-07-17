import z from "zod";
import { createExerciseInput } from "./exercise";

export const getAllWorkoutsInput = z.object({
  limit: z.number().min(1).max(20),
  page: z.number().min(0),
  title: z.string().optional(),
});

export const getSingleWorkoutInput = z.object({
  id: z.string(),
});

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

export const editWorkoutInput = z
  .object({
    workoutId: z.string().min(1),
    title: z.string().min(1, "Title is required"),
  })
  .or(
    z.object({
      workoutId: z.string().min(1),
      description: z.string().min(1, "Description is required"),
    })
  )
  .or(
    z.object({
      workoutId: z.string().min(1),
      breakDuration: z
        .number()
        .min(1, "Break Duration is required")
        .or(z.string().min(1, "Break Duration is required")),
    })
  );

export type editWorkoutSchema = z.TypeOf<typeof editWorkoutInput>;
