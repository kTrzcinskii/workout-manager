import { Input, useToast, UseToastOptions } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { editWorkoutInput, editWorkoutSchema } from "../server/schema/workout";
import { trpc } from "../utils/trpc";
import FormInput from "./FormInput";

interface EditTitleFormProps {
  field: string;
  defaultValue: string;
  workoutId: string;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
  onClose: () => void;
}

const EditTitleForm: React.FC<EditTitleFormProps> = ({
  field,
  defaultValue,
  workoutId,
  setIsSubmitting,
  onClose,
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<editWorkoutSchema>({
    resolver: zodResolver(editWorkoutInput),
  });

  const { mutate } = trpc.useMutation(["workouts.edit-workout"]);
  const invalidateUtils = trpc.useContext();

  const toast = useToast();
  const fieldMessage = field === "breakDuration" ? "break duration" : field;
  const toastOptions = (): UseToastOptions => ({
    position: "top",
    status: "success",
    title: "Success",
    description: `Workout ${fieldMessage} has been edited`,
    isClosable: true,
    duration: 2000,
  });

  const errorToastOptions = (msg: string): UseToastOptions => ({
    position: "top",
    status: "error",
    title: "Error",
    description: msg,
    isClosable: true,
    duration: 3000,
  });

  const onSubmit = (values: editWorkoutSchema) => {
    setIsSubmitting(true);
    mutate(values, {
      onSuccess: () => {
        setIsSubmitting(false);
        invalidateUtils.invalidateQueries(["workouts.get-all-workouts"]);
        invalidateUtils.invalidateQueries([
          "workouts.get-single-workout",
          { id: workoutId },
        ]);
        toast(toastOptions());
        onClose();
      },
      onError: (e) => {
        setIsSubmitting(false);
        toast(errorToastOptions(e.message));
        onClose();
      },
    });
  };

  const type = field === "breakDuration" ? "number" : "text";

  return (
    <form onSubmit={handleSubmit(onSubmit)} id={`edit-${field}-form`}>
      <FormInput
        errors={errors}
        register={register}
        registerName={field}
        placeholder={`Enter ${fieldMessage}`}
        defaultValue={defaultValue}
        variant='gray.800'
        type={type}
      />
      <Input
        id='workoutId'
        {...register("workoutId")}
        name={"workoutId"}
        display='none'
        value={workoutId}
      />
    </form>
  );
};

export default EditTitleForm;
