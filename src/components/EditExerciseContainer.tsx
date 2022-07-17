import {
  Button,
  HStack,
  Input,
  useDisclosure,
  useToast,
  UseToastOptions,
  VStack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Exercise } from "@prisma/client";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import {
  editExerciseInput,
  editExerciseSchema,
} from "../server/schema/exercise";
import { trpc } from "../utils/trpc";
import { EditBtn } from "./EditBtn";
import FormInput from "./FormInput";
import ModalContainer from "./ModalContainer";

interface BodyProps {
  workoutId: string;
  exerciseId: string;
  title: string;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
  series: number;
  repsInOneSeries: number;
  weight: number | null;
  onClose: () => void;
}

const Body: React.FC<BodyProps> = ({
  workoutId,
  exerciseId,
  title,
  series,
  repsInOneSeries,
  weight,
  onClose,
  setIsSubmitting,
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<editExerciseSchema>({
    resolver: zodResolver(editExerciseInput),
  });

  const { mutate } = trpc.useMutation(["exercises.edit-exercise"]);
  const invalidateUtils = trpc.useContext();

  const toast = useToast();
  const successfulToastOptions = (): UseToastOptions => ({
    position: "top",
    status: "success",
    title: "Success",
    description: "Exercise has been successfully edited",
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

  const onSubmit = (values: editExerciseSchema) => {
    setIsSubmitting(true);
    mutate(values, {
      onSuccess: () => {
        setIsSubmitting(false);
        invalidateUtils.invalidateQueries([
          "workouts.get-single-workout",
          { id: workoutId },
        ]);
        invalidateUtils.invalidateQueries(["workouts.get-all-workouts"]);
        onClose();
        toast(successfulToastOptions());
      },
      onError: (e) => {
        setIsSubmitting(false);
        onClose();
        toast(errorToastOptions(e.message));
      },
    });
  };

  return (
    <form
      id={`edit-exercise-${exerciseId}-form`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <VStack spacing={4}>
        <FormInput
          errors={errors}
          register={register}
          registerName='title'
          placeholder='Enter title'
          defaultValue={title}
          variant='gray.800'
          label='Title'
        />
        <FormInput
          errors={errors}
          register={register}
          registerName='series'
          placeholder='Enter series'
          defaultValue={series}
          variant='gray.800'
          label='Series'
          type='number'
        />
        <FormInput
          errors={errors}
          register={register}
          registerName='repsInOneSeries'
          placeholder='Enter number of reps in one Series'
          defaultValue={repsInOneSeries}
          variant='gray.800'
          label='Reps in one Series'
          type='number'
        />
        <FormInput
          errors={errors}
          register={register}
          registerName='weight'
          placeholder='Enter weight'
          defaultValue={weight ? String(weight) : undefined}
          variant='gray.800'
          label='Weight (optional)'
          type='number'
        />
      </VStack>
      <Input
        id='workoutId'
        {...register("workoutId")}
        name={"workoutId"}
        display='none'
        value={workoutId}
      />
      <Input
        id='exerciseId'
        {...register("exerciseId")}
        name={"exerciseId"}
        display='none'
        value={exerciseId}
      />
    </form>
  );
};

interface FooterProps {
  onClose: () => void;
  exerciseId: string;
  isSubmitting: boolean;
}

const Footer: React.FC<FooterProps> = ({
  onClose,
  exerciseId,
  isSubmitting,
}) => {
  return (
    <HStack w='full' justifyContent='space-around'>
      <Button
        type='submit'
        form={`edit-exercise-${exerciseId}-form`}
        isLoading={isSubmitting}
        loadingText='Edit Exercise'
        colorScheme='purple'
      >
        Edit Exercise
      </Button>
      <Button onClick={onClose}>Cancel</Button>
    </HStack>
  );
};

const EditExerciseContainer: React.FC<Exercise> = ({
  workoutId,
  id,
  title,
  repsInOneSeries,
  series,
  weight,
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <>
      <EditBtn ariaLabel='Edit Exercise' onClick={onOpen} />
      <ModalContainer
        header='Edit Exercise'
        isOpen={isOpen}
        onClose={onClose}
        body={
          <Body
            setIsSubmitting={setIsSubmitting}
            workoutId={workoutId}
            exerciseId={id}
            title={title}
            repsInOneSeries={repsInOneSeries}
            series={series}
            weight={weight}
            onClose={onClose}
          />
        }
        footer={
          <Footer
            exerciseId={id}
            isSubmitting={isSubmitting}
            onClose={onClose}
          />
        }
      />
    </>
  );
};

export default EditExerciseContainer;
