import {
  Heading,
  HStack,
  IconButton,
  Text,
  VStack,
  Link,
} from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { BsGithub, BsGoogle } from "react-icons/bs";
import NextLink from "next/link";

const LoginSection: React.FC = () => {
  return (
    <VStack h='100vh' w='full' bgColor='gray.800' justifyContent='center'>
      <VStack spacing={{ base: 4, md: 5, lg: 6 }} role='group'>
        <Heading
          color='white'
          fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
          _hover={{ color: "purple.400" }}
          transition='ease-in-out'
          transitionDuration='150ms'
          _groupHover={{ color: "purple.400" }}
        >
          Workout Manager
        </Heading>
        <VStack spacing={{ base: 4, md: 4, lg: 6 }}>
          <Text color='white' fontSize='2xl'>
            Sign in with
          </Text>
          <HStack spacing={{ base: 4, md: 5, lg: 8 }}>
            <IconButton
              aria-label='login with github'
              colorScheme='purple'
              rounded='lg'
              size='lg'
              onClick={() => signIn("github")}
              icon={<BsGithub size={30} />}
              _hover={{ transform: "translateY(-5px)", bgColor: "purple.600" }}
              transitionDuration='300ms'
            />
            <IconButton
              aria-label='login with google'
              colorScheme='purple'
              rounded='lg'
              size='lg'
              onClick={() => signIn("google")}
              icon={<BsGoogle size={30} />}
              _hover={{ transform: "translateY(-5px)", bgColor: "purple.600" }}
              transitionDuration='300ms'
            />
          </HStack>
        </VStack>
      </VStack>
      <Text
        pos='absolute'
        bottom={6}
        w='full'
        textAlign='center'
        color='white'
        fontSize='xl'
      >
        Created by{" "}
        <NextLink href='https://github.com/kTrzcinskii' passHref={true}>
          <Link color='purple.400'>Kacper Trzciński</Link>
        </NextLink>
      </Text>
    </VStack>
  );
};

export default LoginSection;
