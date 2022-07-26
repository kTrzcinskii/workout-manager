import {
  Box,
  Button,
  chakra,
  Heading,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { Exercise, Workout } from "@prisma/client";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { navbarHeight } from "../constants";
import { trpc } from "../utils/trpc";
import ModalContainer from "./ModalContainer";

interface TextWithSpanProps {
  myKey: string;
  value: string | number;
  additionalText?: string;
  color?: string;
}

const TextWithSpan: React.FC<TextWithSpanProps> = ({
  myKey,
  value,
  additionalText,
  color = "black",
}) => {
  return (
    <Text fontSize='lg'>
      {myKey}:{" "}
      <chakra.span fontWeight='semibold' color={color}>
        {value} {additionalText}
      </chakra.span>
    </Text>
  );
};

interface SmallExerciseCardProps {
  name: string;
  position: "prev" | "next";
  series: number;
  repsInOneSeries: number;
  weigth: number | null;
  isSwitching: boolean;
}

const SmallExerciseCard: React.FC<SmallExerciseCardProps> = ({
  name,
  position,
  series,
  repsInOneSeries,
  weigth,
  isSwitching,
}) => {
  const heading = position === "next" ? "Next exercise:" : "Previous exercise:";

  const weightText = weigth ? ` (${weigth} kg)` : "";
  return (
    <Box
      bgColor='gray.200'
      rounded='lg'
      px={5}
      py={4}
      minW='300px'
      minH='100px'
    >
      <Box
        opacity={isSwitching ? 0 : 1}
        transition='ease-in-out'
        transitionDuration='300ms'
      >
        <Heading fontSize='3xl' color='purple.500'>
          {heading}
        </Heading>
        <Text fontWeight='semibold'>
          {name} {series}x{repsInOneSeries}
          {weightText}
        </Text>
      </Box>
    </Box>
  );
};

const Placeholder: React.FC = () => {
  return (
    <Box
      bgColor='gray.700'
      px={5}
      py={4}
      minW='300px'
      minH='100px'
      display={{ base: "none", md: "none", lg: "block" }}
    />
  );
};

interface BreakCardProps {
  setIsBreak: Dispatch<SetStateAction<boolean>>;
  breakDuration: number;
}

const transformTime = (time: number) => {
  if (time < 10) {
    return `0${time}`;
  }
  return String(time);
};

const BreakCard: React.FC<BreakCardProps> = ({ setIsBreak, breakDuration }) => {
  const initialMinutes = Math.floor(breakDuration / 60);
  const [minutesLeft, setMinutesLeft] = useState(initialMinutes);
  const initialSeconds = breakDuration - initialMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const initialTime = `${transformTime(minutesLeft)}:${transformTime(
    secondsLeft
  )}`;
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft === "00:00") {
      const myAudio = document.getElementById("beep") as HTMLAudioElement;
      myAudio.play();
    }

    const myTimeout = setTimeout(() => {
      if (timeLeft === "00:00") {
        setIsBreak(false);
      }
      if (secondsLeft > 0) {
        setSecondsLeft((prev) => prev - 1);
        const newSeconds = transformTime(secondsLeft - 1);
        setTimeLeft(`${transformTime(minutesLeft)}:${newSeconds}`);
      }
      if (minutesLeft > 0 && secondsLeft === 0) {
        setMinutesLeft((prev) => prev - 1);
        setSecondsLeft(59);
        setTimeLeft(`${transformTime(minutesLeft - 1)}:59`);
      }
    }, 1000);

    return () => clearTimeout(myTimeout);
  }, [timeLeft, minutesLeft, secondsLeft, setIsBreak]);

  return (
    <VStack
      px={10}
      py={8}
      justifyContent='center'
      minW='320px'
      minH='316px'
      rounded='lg'
      bgColor='gray.500'
    >
      <Heading fontSize='5xl' color='purple.600'>
        Break
      </Heading>
      <Text color='white' fontSize='3xl' fontWeight='semibold'>
        {timeLeft}
      </Text>
    </VStack>
  );
};

interface CurrentExerciseCardProps {
  setIsBreak: Dispatch<SetStateAction<boolean>>;
  setIsFinished: Dispatch<SetStateAction<boolean>>;
  setIsSwitching: Dispatch<SetStateAction<boolean>>;
  name: string;
  series: number;
  repsInOneSeries: number;
  weight: number | null;
  setCurrentExerciseIndex: Dispatch<SetStateAction<number>>;
  allExercisesNumber: number;
  curretExerciseIdex: number;
  isFinished: boolean;
  seriesNumber: number;
  setSeriesNumber: Dispatch<SetStateAction<number>>;
  isSwitching: boolean;
}

const CurrentExerciseCard: React.FC<CurrentExerciseCardProps> = ({
  setIsBreak,
  name,
  series,
  repsInOneSeries,
  weight,
  setCurrentExerciseIndex,
  allExercisesNumber,
  curretExerciseIdex,
  setIsFinished,
  isFinished,
  seriesNumber,
  setSeriesNumber,
  setIsSwitching,
  isSwitching,
}) => {
  const isItLastSeriesAfterClck =
    seriesNumber + 1 === series &&
    allExercisesNumber - 1 === curretExerciseIdex;

  return (
    <VStack
      bgColor='purple.400'
      color='white'
      px={10}
      py={8}
      justifyContent='center'
      minW='320px'
      minH='316px'
      rounded='lg'
    >
      <VStack
        opacity={isSwitching ? 0 : 1}
        transition='ease-in-out'
        transitionDuration='300ms'
      >
        <Heading fontSize='4xl'>{name}</Heading>
        <TextWithSpan myKey='Total Series' value={series} color='purple.900' />
        <TextWithSpan
          myKey='Reps in one Series'
          value={repsInOneSeries}
          color='purple.900'
        />
        {weight && (
          <TextWithSpan
            myKey='Weight'
            value={weight}
            color='purple.900'
            additionalText='kg'
          />
        )}
        <TextWithSpan
          myKey='Completed Series'
          value={`${seriesNumber} / ${series}`}
          color='purple.900'
        />
        <Box pt={5}>
          {seriesNumber < series ? (
            <Button
              colorScheme='purple'
              minW='174px'
              onClick={() => {
                if (!isItLastSeriesAfterClck) {
                  setIsBreak(true);
                } else {
                  setIsFinished(true);
                }
                setSeriesNumber((prev) => prev + 1);
              }}
            >
              Series Done
            </Button>
          ) : (
            <Button
              colorScheme='purple'
              minW='174px'
              onClick={() => {
                setIsSwitching(true);
                setTimeout(
                  () => setCurrentExerciseIndex((prev) => prev + 1),
                  200
                );
                setSeriesNumber(0);
              }}
              disabled={isFinished}
            >
              Go to Next Exercise
            </Button>
          )}
        </Box>
      </VStack>
    </VStack>
  );
};

type StartedWorkoutProps = Workout & {
  exercises: Exercise[];
} & { setIsStarted: Dispatch<SetStateAction<boolean>> };

const StartedWorkout: React.FC<StartedWorkoutProps> = ({
  setIsStarted,
  title,
  exercises,
  breakDuration,
  id,
}) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [seriesNumber, setSeriesNumber] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSwitching, setIsSwitching] = useState(false);
  const { mutate } = trpc.useMutation(["users.increase-num-of-done-workouts"]);
  const invalidateUtils = trpc.useContext();
  const router = useRouter();

  useEffect(() => {
    if (isFinished) {
      onOpen();
    }
  }, [isFinished, onOpen]);

  useEffect(() => {
    if (isSwitching) {
      const timeout = setTimeout(() => setIsSwitching(false), 600);
      return () => clearTimeout(timeout);
    }
  }, [isSwitching]);

  return (
    <>
      <VStack
        minH={`calc(100vh - ${navbarHeight})`}
        bgColor='gray.700'
        w='full'
        justifyContent='center'
        alignItems='center'
        spacing={12}
      >
        <Heading color='purple.500' fontSize={{ base: "4xl", md: "5xl" }}>
          {title}
        </Heading>
        <Stack
          direction={{ base: "column", md: "column", lg: "row" }}
          justifyContent='center'
          alignItems='center'
          spacing={10}
        >
          {currentExerciseIndex - 1 >= 0 &&
          exercises[currentExerciseIndex - 1] ? (
            <SmallExerciseCard
              name={exercises[currentExerciseIndex - 1]!.title}
              position='prev'
              series={exercises[currentExerciseIndex - 1]!.series}
              repsInOneSeries={
                exercises[currentExerciseIndex - 1]!.repsInOneSeries
              }
              weigth={exercises[currentExerciseIndex - 1]!.weight}
              isSwitching={isSwitching}
            />
          ) : (
            <Placeholder />
          )}
          {isBreak ? (
            <BreakCard breakDuration={breakDuration} setIsBreak={setIsBreak} />
          ) : (
            <CurrentExerciseCard
              setIsBreak={setIsBreak}
              name={exercises[currentExerciseIndex]!.title}
              repsInOneSeries={exercises[currentExerciseIndex]!.repsInOneSeries}
              series={exercises[currentExerciseIndex]!.series}
              weight={exercises[currentExerciseIndex]!.weight}
              setCurrentExerciseIndex={setCurrentExerciseIndex}
              allExercisesNumber={exercises.length}
              curretExerciseIdex={currentExerciseIndex}
              setIsFinished={setIsFinished}
              isFinished={isFinished}
              seriesNumber={seriesNumber}
              setSeriesNumber={setSeriesNumber}
              setIsSwitching={setIsSwitching}
              isSwitching={isSwitching}
            />
          )}
          {currentExerciseIndex + 1 < exercises.length &&
          exercises[currentExerciseIndex + 1] ? (
            <SmallExerciseCard
              name={exercises[currentExerciseIndex + 1]!.title}
              position='next'
              series={exercises[currentExerciseIndex + 1]!.series}
              repsInOneSeries={
                exercises[currentExerciseIndex + 1]!.repsInOneSeries
              }
              weigth={exercises[currentExerciseIndex + 1]!.weight}
              isSwitching={isSwitching}
            />
          ) : (
            <Placeholder />
          )}
        </Stack>
        <Box py={10}>
          <Button colorScheme='red' onClick={() => setIsStarted(false)}>
            Stop Workout
          </Button>
        </Box>
        <audio id='beep' src='/alarm_sound.mp3'></audio>
      </VStack>
      <ModalContainer
        showCloseBtn={false}
        header='Workout Finished'
        body={
          <Text>
            Well done! You&apos;ve completed &quot;{title}&quot; workout. Now
            take your rest!
          </Text>
        }
        footer={
          <Button
            onClick={() => {
              mutate(
                { workoutId: id },
                {
                  onSuccess: () => {
                    invalidateUtils.invalidateQueries(["users.get-user-info"]);
                  },
                }
              );
              router.push("/");
            }}
            colorScheme='purple'
          >
            Finish Workout
          </Button>
        }
        onClose={onClose}
        isOpen={isOpen}
        closeOnClickOnOverlay={false}
      />
    </>
  );
};

export default StartedWorkout;
