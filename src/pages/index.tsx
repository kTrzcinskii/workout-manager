import { Button, Heading, HStack, VStack } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();

  return (
    <VStack h='100vh' w='full' bgColor='gray.800' justifyContent='center'>
      <VStack spacing={{ base: 5, md: 8, lg: 10 }} role='group'>
        <Heading
          color='white'
          fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
          _hover={{ color: "purple.400" }}
          transition='ease-in-out'
          transitionDuration='150ms'
          _groupHover={{ color: "purple.400", transform: "translateY(-15px)" }}
        >
          Workout Manager
        </Heading>
        <HStack spacing={{ base: 4, md: 5, lg: 8 }}>
          <Button
            colorScheme='purple'
            rounded='lg'
            minW='94px'
            onClick={() => router.push("/login")}
          >
            Login
          </Button>
          <Button
            colorScheme='purple'
            rounded='lg'
            minW='94px'
            onClick={() => router.push("/register")}
          >
            Register
          </Button>
        </HStack>
      </VStack>
    </VStack>
  );
};

export default Home;
