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
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { addExerciseInput, addExerciseSchema } from "../server/schema/exercise";
import { trpc } from "../utils/trpc";
import FormInput from "./FormInput";
import ModalContainer from "./ModalContainer";

interface BodyProps {
  arrLength: number;
  workoutId: string;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
  onClose: () => void;
}

const Body: React.FC<BodyProps> = ({
  arrLength,
  workoutId,
  setIsSubmitting,
  onClose,
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<addExerciseSchema>({
    resolver: zodResolver(addExerciseInput),
  });

  const { mutate } = trpc.useMutation([
    "exercises.add-exercise-to-existing-project",
  ]);
  const invalidateUtils = trpc.useContext();

  const toast = useToast();
  const successfulToastOptions = (): UseToastOptions => ({
    position: "top",
    status: "success",
    title: "Success",
    description: "Exercise has been successfully added",
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

  const onSubmit = (values: addExerciseSchema) => {
    setIsSubmitting(true);
    mutate(values, {
      onSuccess: () => {
        setIsSubmitting(false);
        invalidateUtils.invalidateQueries(["workouts.get-all-workouts"]);
        invalidateUtils.invalidateQueries([
          "workouts.get-single-workout",
          { id: workoutId },
        ]);
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
    <form id='add-new-exercise-form' onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={4}>
        <FormInput
          errors={errors}
          register={register}
          registerName='title'
          placeholder='Enter title'
          variant='gray.800'
          label='Title'
        />
        <FormInput
          errors={errors}
          register={register}
          registerName='series'
          placeholder='Enter series'
          variant='gray.800'
          label='Series'
          type='number'
        />
        <FormInput
          errors={errors}
          register={register}
          registerName='repsInOneSeries'
          placeholder='Enter number of reps in one Series'
          variant='gray.800'
          label='Reps in one Series'
          type='number'
        />
        <FormInput
          errors={errors}
          register={register}
          registerName='weight'
          placeholder='Enter weight'
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
        id='index'
        {...register("index")}
        name={"index"}
        display='none'
        value={arrLength}
      />
    </form>
  );
};

interface FooterProps {
  isSubmitting: boolean;
  onClose: () => void;
}

const Footer: React.FC<FooterProps> = ({ isSubmitting, onClose }) => {
  return (
    <HStack w='full' justifyContent='space-around'>
      <Button
        type='submit'
        form='add-new-exercise-form'
        isLoading={isSubmitting}
        loadingText='Add Exercise'
        colorScheme='purple'
      >
        Add Exercise
      </Button>
      <Button onClick={onClose}>Cancel</Button>
    </HStack>
  );
};

interface AddExerciseBtnProps {
  arrLength: number;
  workoutId: string;
}

const AddExerciseBtn: React.FC<AddExerciseBtnProps> = ({
  arrLength,
  workoutId,
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <>
      <Button colorScheme='purple' rounded='lg' onClick={onOpen}>
        Add Exercise
      </Button>
      <ModalContainer
        header='Add Exercise'
        body={
          <Body
            arrLength={arrLength}
            workoutId={workoutId}
            setIsSubmitting={setIsSubmitting}
            onClose={onClose}
          />
        }
        footer={<Footer isSubmitting={isSubmitting} onClose={onClose} />}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
};

export default AddExerciseBtn;
