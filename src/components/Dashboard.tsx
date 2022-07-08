import { Button, Text, VStack } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { navbarHeight } from "../constants";
import { trpc } from "../utils/trpc";
import ErrorMessage from "./ErrorMessage";
import LoadingSpinner from "./LoadingSpinner";
import Navbar from "./Navbar";

const Dashboard: React.FC = () => {
  const { data: session } = useSession();

  const [page, setPage] = useState(0);
  const { data, isLoading, isError, error } = trpc.useQuery([
    "workouts.get-all-workouts",
    {
      limit: 10,
      page,
    },
  ]);

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

  if (!data.workouts || data.workouts.length === 0) {
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
      <Text>test</Text>
    </Navbar>
  );
};

export default Dashboard;
