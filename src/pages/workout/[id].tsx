import {
  Box,
  chakra,
  Heading,
  HStack,
  IconButton,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { format } from "date-fns";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { BsFillPlayFill } from "react-icons/bs";
import AddExerciseBtn from "../../components/AddExerciseBtn";
import EditContainer from "../../components/EditContainer";
import ErrorMessage from "../../components/ErrorMessage";
import ExerciseCard from "../../components/ExerciseCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import Navbar from "../../components/Navbar";
import StartedWorkout from "../../components/StartedWorkout";
import { navbarHeight } from "../../constants";
import { trpc } from "../../utils/trpc";

const SingleWorkoutPage: NextPage = () => {
  const [isStarted, setIsStarted] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  const workoutId = String(id);

  const { data, isLoading, isError, error } = trpc.useQuery([
    "workouts.get-single-workout",
    { id: workoutId },
  ]);

  if (isLoading) {
    return (
      <Navbar>
        <LoadingSpinner />
      </Navbar>
    );
  }

  if (isError || !data) {
    const message = error?.message || undefined;
    return <ErrorMessage customMessage={message} />;
  }

  const createdOnFormatted = format(data.createdAt, "do MMMM yyyy");
  const updatedOnFormatted = format(data.updatedAt, "do MMMM yyyy");

  if (!isStarted) {
    return (
      <Navbar>
        <VStack
          minH={`calc(100vh - ${navbarHeight})`}
          bgColor='gray.700'
          w='full'
          pt={5}
          px={6}
          spacing={8}
        >
          <Stack
            w='full'
            direction={{ base: "column", md: "column", lg: "row" }}
            justifyContent='space-between'
          >
            <VStack>
              <HStack spacing={2} w='full'>
                <Heading
                  fontSize={{ base: "3xl", md: "4xl", lg: "4xl" }}
                  color='white'
                >
                  Workout:{" "}
                  <chakra.span color='purple.500'>{data.title}</chakra.span>
                </Heading>
                <EditContainer
                  header='Edit Title'
                  btnText='Edit Title'
                  defaultValue={data.title}
                  formId='edit-title-form'
                  workoutId={data.id}
                  ariaLabel='Edit title'
                  field='title'
                />
              </HStack>
              <HStack w='full' fontSize='xl'>
                <Text color='white'>
                  Description:{" "}
                  <chakra.span color='purple.500'>
                    {data.description}
                  </chakra.span>
                </Text>
                <EditContainer
                  header='Edit Description'
                  btnText='Edit Description'
                  defaultValue={data.description}
                  formId='edit-description-form'
                  workoutId={data.id}
                  ariaLabel='Edit description'
                  field='description'
                  fontSize='xl'
                />
              </HStack>
              <HStack w='full'>
                <Text color='white' fontSize='lg'>
                  Break duration between every exercises:{" "}
                  <chakra.span color='purple.500'>
                    {data.breakDuration} seconds
                  </chakra.span>{" "}
                  <EditContainer
                    header='Edit Break Duration'
                    btnText='Edit Break Duration'
                    defaultValue={String(data.breakDuration)}
                    formId='edit-breakDuration-form'
                    workoutId={data.id}
                    ariaLabel='Edit break duration'
                    field='breakDuration'
                    fontSize='lg'
                  />
                </Text>
              </HStack>
            </VStack>
            <VStack fontSize='lg'>
              <Text color='white' w='full'>
                Created on:{" "}
                <chakra.span color='purple.500' fontWeight='semibold'>
                  {createdOnFormatted}
                </chakra.span>
              </Text>
              <Text color='white' w='full'>
                Updated on:{" "}
                <chakra.span color='purple.500' fontWeight='semibold'>
                  {updatedOnFormatted}
                </chakra.span>
              </Text>
            </VStack>
          </Stack>
          <Text color='white' fontSize='3xl' w='full' textAlign='center'>
            Exercises:
          </Text>
          <VStack w='full' spacing={5} alignItems='center'>
            {data.exercises.map((exercise) => {
              return (
                <ExerciseCard
                  key={exercise.id}
                  {...exercise}
                  arrLength={data.exercises.length}
                />
              );
            })}
          </VStack>
          <AddExerciseBtn
            arrLength={data.exercises.length}
            workoutId={data.id}
          />
          <Box py={20}>
            <IconButton
              aria-label='Start workout'
              colorScheme='purple'
              rounded='2xl'
              boxSize={20}
              icon={
                <BsFillPlayFill size={70} onClick={() => setIsStarted(true)} />
              }
            />
          </Box>
        </VStack>
      </Navbar>
    );
  }

  return (
    <Navbar>
      <StartedWorkout {...data} setIsStarted={setIsStarted} />
    </Navbar>
  );
};

export default SingleWorkoutPage;
