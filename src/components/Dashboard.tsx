import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Search2Icon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { navbarHeight } from "../constants";
import { trpc } from "../utils/trpc";
import ErrorMessage from "./ErrorMessage";
import LoadingSpinner from "./LoadingSpinner";
import Navbar from "./Navbar";
import WorkoutCard from "./WorkoutCard";

const Dashboard: React.FC = () => {
  const { data: session } = useSession();

  const [page, setPage] = useState(0);
  const [title, setTitle] = useState("");
  const [titleFilter, setTitleFilter] = useState("");
  const { data, isLoading, isError, error } = trpc.useQuery([
    "workouts.get-all-workouts",
    {
      limit: 12,
      page,
      title: titleFilter,
    },
  ]);

  useEffect(() => {
    if (title === "") {
      setTitleFilter("");
    }
  }, [title, setTitleFilter]);

  const router = useRouter();

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

  if ((!data.workouts || data.workouts.length === 0) && titleFilter === "") {
    return (
      <Navbar>
        <VStack
          minH={`calc(100vh - ${navbarHeight})`}
          bgColor='gray.700'
          w='full'
          justifyContent='center'
          spacing={4}
        >
          <Text
            color='white'
            width={{ base: "90%", md: "85%", lg: "70%" }}
            textAlign='center'
            fontSize='xl'
          >
            It looks like you don&apos;t have any workout created yet.
            Let&apos;s change it!
          </Text>
          <Button
            colorScheme='purple'
            onClick={() => router.push("/create-workout")}
          >
            Create Workout
          </Button>
        </VStack>
      </Navbar>
    );
  }

  return (
    <Navbar>
      <VStack
        minH={`calc(100vh - ${navbarHeight})`}
        bgColor='gray.700'
        w='full'
        pt={10}
        pb={10}
        spacing={6}
        pos='relative'
      >
        <Box>
          <Button
            colorScheme='purple'
            onClick={() => router.push("/create-workout")}
          >
            Create Workout
          </Button>
        </Box>
        <HStack width={{ base: "300px", md: "350px", lg: "450px" }}>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            bgColor='white'
            focusBorderColor='purple.500'
            borderWidth={2}
            placeholder='Search for your workout...'
          />
          <IconButton
            aria-label='search'
            icon={<Search2Icon />}
            colorScheme='purple'
            onClick={() => setTitleFilter(title)}
          />
        </HStack>
        <Grid
          templateColumns={{
            base: "1fr",
            lg: "repeat(2, 1fr)",
            xl: "repeat(3, 1fr)",
          }}
          templateRows={{
            base: "6fr",
            lg: "repeat(3, 1fr)",
            xl: "repeat(2, 1fr)",
          }}
          gap={5}
          mt={5}
          pb={10}
          maxW={{ base: "300px", md: "350px", lg: "650px", xl: "850px" }}
        >
          {data.workouts.map((workout) => {
            return (
              <GridItem key={workout.id}>
                <WorkoutCard {...workout} />
              </GridItem>
            );
          })}
        </Grid>
        <HStack spacing={3} pos='absolute' bottom={5} pt={2}>
          <IconButton
            aria-label='Go to previous page'
            disabled={page === 0}
            icon={<ChevronLeftIcon />}
            colorScheme='purple'
            fontSize='2xl'
            onClick={() => setPage((page) => page - 1)}
          />
          <IconButton
            aria-label='Go to next page'
            disabled={!data.hasMore}
            icon={<ChevronRightIcon />}
            colorScheme='purple'
            fontSize='2xl'
            onClick={() => setPage((page) => page + 1)}
          />
        </HStack>
      </VStack>
    </Navbar>
  );
};

export default Dashboard;
