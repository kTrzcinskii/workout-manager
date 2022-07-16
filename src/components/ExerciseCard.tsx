import { TriangleUpIcon, TriangleDownIcon } from "@chakra-ui/icons";
import {
  HStack,
  Text,
  chakra,
  IconButton,
  Stack,
  UseToastOptions,
  useToast,
} from "@chakra-ui/react";
import { Exercise } from "@prisma/client";
import { trpc } from "../utils/trpc";
import { EditBtn } from "./EditBtn";

type ExerciseCardProps = Exercise & {
  arrLength: number;
};

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  index,
  title,
  series,
  repsInOneSeries,
  weight,
  id,
  arrLength,
  workoutId,
}) => {
  const { mutate } = trpc.useMutation("exercises.change-index");
  const invalidateUtils = trpc.useContext();

  const toast = useToast();
  const errorToastOptions = (msg: string): UseToastOptions => ({
    position: "top",
    status: "error",
    title: "Error",
    description: msg,
    isClosable: true,
    duration: 3000,
  });

  const handleClick = (newIndex: number) => {
    mutate(
      { workoutId, exerciseId: id, newIndex },
      {
        onSuccess: () => {
          invalidateUtils.invalidateQueries([
            "workouts.get-single-workout",
            { id: workoutId },
          ]);
        },
        onError: (e) => {
          toast(errorToastOptions(e.message));
        },
      }
    );
  };

  return (
    <Stack
      w={{ base: "full", md: "full", lg: "700px", xl: "750px" }}
      bgColor='white'
      py={5}
      px={6}
      rounded='lg'
      fontSize='xl'
      justifyContent='space-between'
      direction={{ base: "column", md: "column", lg: "row" }}
    >
      <HStack
        spacing={3}
        w={{ base: "full", md: "full", lg: "auto" }}
        justifyContent='center'
        fontSize={{ base: "3xl", md: "3xl", lg: "xl" }}
      >
        <Text fontWeight='bold' color='purple.500'>
          {index + 1}
        </Text>
        <Text color='gray.800'>{title}</Text>
      </HStack>
      <HStack
        spacing={4}
        w={{ base: "full", md: "full", lg: "auto" }}
        justifyContent='center'
      >
        <Text>
          Series:{" "}
          <chakra.span fontWeight='semibold' color='purple.500'>
            {series}
          </chakra.span>
        </Text>
        <Text>
          Reps:{" "}
          <chakra.span fontWeight='semibold' color='purple.500'>
            {repsInOneSeries}
          </chakra.span>
        </Text>
        {weight && (
          <Text>
            Weight:{" "}
            <chakra.span fontWeight='semibold' color='purple.500'>
              {weight} kg
            </chakra.span>
          </Text>
        )}
      </HStack>
      <HStack
        spacing={5}
        w={{ base: "full", md: "full", lg: "auto" }}
        justifyContent='center'
      >
        <EditBtn
          onClick={() => console.log("edit exercise")}
          ariaLabel='Edit Exercise'
        />
        <HStack spacing={1}>
          <IconButton
            aria-label='move up'
            icon={<TriangleUpIcon />}
            colorScheme='purple'
            fontSize='2xl'
            variant='ghost'
            _hover={{
              bgColor: "purple.500",
              color: "white",
            }}
            disabled={index === 0}
            onClick={() => handleClick(index - 1)}
          />
          <IconButton
            aria-label='move down'
            icon={<TriangleDownIcon />}
            colorScheme='purple'
            fontSize='2xl'
            variant='ghost'
            _hover={{
              bgColor: "purple.500",
              color: "white",
            }}
            disabled={arrLength - 1 === index}
            onClick={() => handleClick(index + 1)}
          />
        </HStack>
      </HStack>
    </Stack>
  );
};

export default ExerciseCard;
