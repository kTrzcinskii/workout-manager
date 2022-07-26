import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  Text,
  VStack,
  Link,
  Button,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { ReactNode } from "react";
import ErrorMessage from "../components/ErrorMessage";
import Navbar from "../components/Navbar";
import { navbarHeight } from "../constants";
import NextLink from "next/link";
import { useRouter } from "next/router";

interface MyAccordionItemProps {
  title: string;
  value: string | ReactNode;
}

const MyAccordionItem: React.FC<MyAccordionItemProps> = ({ title, value }) => {
  return (
    <Accordion allowToggle w='full'>
      <AccordionItem rounded='lg' bgColor='purple.50' borderWidth={0}>
        <h2>
          <AccordionButton
            bgColor='purple.50'
            rounded='lg'
            _expanded={{
              bgColor: "purple.500",
              color: "white",
              rounded: "none",
              roundedTop: "lg",
            }}
          >
            <Box flex='1' textAlign='left' fontWeight='semibold' fontSize='lg'>
              {title}
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>{value}</AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

const AboutPage: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    return (
      <Navbar>
        <VStack
          minH={`calc(100vh - ${navbarHeight})`}
          bgColor='gray.700'
          w={{ base: "90%", md: "85%", lg: "600px", xl: "700px" }}
          spacing={10}
          py={10}
        >
          <Heading
            color='purple.600'
            fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
          >
            About Workout Manager
          </Heading>
          <MyAccordionItem
            title='What is it?'
            value='Workout Manager is a tool that lets you conveniently do your workout without having to track your series and breaks on your own.'
          />
          <MyAccordionItem
            title='How does it work?'
            value='Once you sign in with your GitHub or Google account, you just have to create new workout. From there you just have to go to the workout page and click start button. The workout will automatically start and only thing you need to do is to click on the button once you finish each series.'
          />
          <MyAccordionItem
            title='Is it free?'
            value='Yes, Workout Manager is completely free.'
          />
          <MyAccordionItem
            title='Created by'
            value={
              <Text>
                It was created by{" "}
                <NextLink
                  href='https://github.com/kTrzcinskii'
                  passHref
                  target='_blank'
                >
                  <Link
                    fontWeight='semibold'
                    color='purple.500'
                    target='_blank'
                  >
                    Kacper Trzciński
                  </Link>
                </NextLink>
              </Text>
            }
          />
          <Box py={12}>
            <Button onClick={() => router.push("/")} colorScheme='purple'>
              Go to Home Page
            </Button>
          </Box>
        </VStack>
      </Navbar>
    );
  }

  return <ErrorMessage customMessage="You aren't signed in" />;
};

export default AboutPage;
