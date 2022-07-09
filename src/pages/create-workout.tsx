import {
  Button,
  Heading,
  useToast,
  UseToastOptions,
  VStack,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { useFieldArray, useForm } from "react-hook-form";
import FormInput from "../components/FormInput";
import Navbar from "../components/Navbar";
import { navbarHeight } from "../constants";
import {
  createWorkoutInput,
  createWorkoutSchema,
} from "../server/schema/workout";
import { trpc } from "../utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import ExerciseInput from "../components/ExerciseInput";
import { useRouter } from "next/router";

const CreateWorkoutPage: NextPage = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
  } = useForm<createWorkoutSchema>({
    resolver: zodResolver(createWorkoutInput),
  });
  const { fields, append, remove, move } = useFieldArray({
    name: "exercises",
    control,
  });

  const { mutate } = trpc.useMutation(["workouts.create-workout"]);

  const router = useRouter();
  const onSubmit = (values: createWorkoutSchema) => {
    mutate(
      { ...values, breakDuration: Number(values.breakDuration) },
      {
        onSuccess: (r) => {
          router.push(`/workout/${r.workoutId}`);
        },
        onError: (e) => {
          toast(toastOptions(e.message));
        },
      }
    );
  };
  const onError = () => {
    if (fields.length === 0) {
      toast(toastOptions("Your workout must contain at least one exercise!")),
        append({
          index: undefined,
          repsInOneSeries: undefined,
          series: undefined,
          title: undefined,
          weight: undefined,
        });
    }
  };

  const toastOptions = (mess: string): UseToastOptions => ({
    status: "error",
    title: "Error",
    description: mess,
    isClosable: true,
    duration: 2000,
    position: "top",
  });

  const toast = useToast();

  return (
    <Navbar>
      <VStack
        minH={`calc(100vh - ${navbarHeight})`}
        bgColor='gray.700'
        w='full'
        justifyContent='center'
        spacing={{ base: 8, md: 10, lg: 12 }}
        pb={10}
        pt={10}
      >
        <Heading
          color='purple.400'
          fontSize={{ base: "4xl", md: "4xl", lg: "5xl" }}
          transition='ease-in-out'
          transitionDuration='100ms'
        >
          Create Workout
        </Heading>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <VStack
            w={{ base: "280px", md: "450px", lg: "480px" }}
            spacing={{ base: 5, md: 6, lg: 8 }}
          >
            <FormInput
              errors={errors}
              register={register}
              registerName='title'
              placeholder='Enter title'
              label='Title'
            />
            <FormInput
              errors={errors}
              register={register}
              registerName='description'
              placeholder='Enter description'
              label='Description'
            />
            <FormInput
              errors={errors}
              register={register}
              registerName='breakDuration'
              placeholder='Enter break duration in seconds.'
              label='Break Duration'
              isNumberInput={true}
              minValue={1}
            />
            {fields.map((field, index) => {
              return (
                <ExerciseInput
                  key={field.id}
                  errors={errors}
                  register={register}
                  index={index}
                  remove={remove}
                  id={field.id}
                  move={move}
                  fieldsLength={fields.length}
                />
              );
            })}
            <Button
              onClick={() =>
                append({
                  repsInOneSeries: undefined,
                  series: undefined,
                  title: undefined,
                  weight: undefined,
                  index: undefined,
                })
              }
              colorScheme='gray'
            >
              Add Exercise
            </Button>
            <Button
              type='submit'
              isLoading={isSubmitting}
              loadingText='Create Workout'
              colorScheme='purple'
            >
              Create Workout
            </Button>
          </VStack>
        </form>
      </VStack>
    </Navbar>
  );
};

export default CreateWorkoutPage;
