import { Box, Stack, Text, VStack, chakra, Link } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";
import { navbarHeight } from "../constants";
import { trpc } from "../utils/trpc";
import NextLink from "next/link";

interface TextWithSpanProps {
  name: string;
  value: string | number;
}

const TextWithSpan: React.FC<TextWithSpanProps> = ({ name, value }) => {
  return (
    <Text
      color='purple.500'
      fontSize={{ base: "xl", md: "xl", lg: "2xl" }}
      w='full'
    >
      {name}:{" "}
      <chakra.span color='white' fontWeight='semibold'>
        {value}
      </chakra.span>
    </Text>
  );
};

interface TextWithLinkProps {
  link: string;
  title: string;
  name: string;
}

const TextWithLink: React.FC<TextWithLinkProps> = ({ link, title, name }) => {
  const href = `/workout/${link}`;

  return (
    <Text
      color='purple.500'
      fontSize={{ base: "xl", md: "xl", lg: "2xl" }}
      w='full'
    >
      {name}:{" "}
      <NextLink href={href} passHref={true}>
        <Link color='white' fontWeight='semibold'>
          {title}
        </Link>
      </NextLink>
    </Text>
  );
};

const ProfilePage: NextPage = () => {
  const { data: session } = useSession();
  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    error: errorUser,
  } = trpc.useQuery([
    "users.get-user-info",
    { userEmail: session?.user!.email! },
  ]);

  if (isLoadingUser) {
    return (
      <Navbar>
        <LoadingSpinner />
      </Navbar>
    );
  }

  if (!user) {
    return <ErrorMessage customMessage="You aren't signed in" />;
  }

  if (isErrorUser) {
    return <ErrorMessage customMessage={errorUser.message} />;
  }

  if (session) {
    return (
      <Navbar>
        <VStack
          minH={`calc(100vh - ${navbarHeight})`}
          bgColor='gray.700'
          w='full'
          spacing={4}
          py={10}
        >
          <Stack
            direction={{ base: "column", md: "column", lg: "row" }}
            spacing={{ base: 10, md: 12, lg: 16 }}
          >
            <Box
              width={{ base: "150px", md: "200px", lg: "300px" }}
              height={{ base: "150px", md: "200px", lg: "300px" }}
              position='relative'
              mx='auto'
            >
              <Image layout='fill' src={user.image!} alt='User Avatar' />
            </Box>
            <VStack
              height={{ base: "auto", md: "auto", lg: "300px" }}
              justifyContent='center'
              minW='364px'
            >
              <TextWithSpan name='Username' value={user.name!} />
              <TextWithSpan name='Email' value={user.email!} />
              <TextWithSpan
                name='Number of created workouts'
                value={user.numOfWorkouts}
              />
              <TextWithSpan
                name='Number of completed workouts'
                value={user.numOfDoneWorkouts}
              />
            </VStack>
          </Stack>
          <VStack pt={8}>
            {user.favoriteWorkout.workoutId && user.favoriteWorkout.name && (
              <TextWithLink
                link={user.favoriteWorkout.workoutId}
                name='Your favorite workout'
                title={user.favoriteWorkout.name}
              />
            )}
            {user.lastDoneWorkout.workoutId && user.lastDoneWorkout.name && (
              <TextWithLink
                link={user.lastDoneWorkout.workoutId}
                name='Your last done workout'
                title={user.lastDoneWorkout.name}
              />
            )}
          </VStack>
        </VStack>
      </Navbar>
    );
  }

  return <ErrorMessage customMessage="You aren't logged in" />;
};

export default ProfilePage;
