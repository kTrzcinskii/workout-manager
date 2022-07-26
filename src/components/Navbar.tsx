import {
  VStack,
  HStack,
  Heading,
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { CgProfile } from "react-icons/cg";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { VscSignOut } from "react-icons/vsc";
import ErrorMessage from "./ErrorMessage";

interface NavbarProps {
  children?: ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    return <ErrorMessage customMessage="You aren't signed in." />;
  }

  return (
    <VStack bgColor='gray.700' minH='100vh'>
      <HStack
        w='full'
        justifyContent='space-between'
        pr={10}
        pl={10}
        bgColor='gray.900'
        py={6}
      >
        <Heading
          color='purple.500'
          fontSize={{ base: "2xl", md: "2xl", lg: "4xl" }}
          cursor='pointer'
          onClick={() => router.push("/")}
        >
          Workout Manager
        </Heading>
        <HStack spacing={4}>
          <Text
            display={{ base: "none", md: "none", lg: "inline" }}
            color='white'
            fontSize='xl'
            fontWeight='semibold'
          >
            {session.user?.name}
          </Text>
          <Menu>
            <MenuButton>
              <Box
                width='60px'
                height='60px'
                pos='relative'
                borderWidth={2}
                borderColor='purple.500'
                cursor='pointer'
              >
                {session.user?.image && (
                  <Image
                    src={session.user.image}
                    alt="User's avatar"
                    layout='fill'
                  />
                )}
              </Box>
            </MenuButton>
            <MenuList
              bgColor='gray.800'
              borderColor='purple.500'
              borderWidth={2}
            >
              <MenuItem
                _hover={{ bgColor: "purple.500" }}
                _focus={{ bgColor: "purple.500" }}
                color='white'
                fontWeight='semibold'
                icon={<CgProfile size={20} />}
                onClick={() => router.push("/profile")}
              >
                Profile
              </MenuItem>
              <MenuItem
                _hover={{ bgColor: "purple.500" }}
                _focus={{ bgColor: "purple.500" }}
                color='white'
                fontWeight='semibold'
                icon={<AiOutlineInfoCircle size={20} />}
                onClick={() => router.push("/about")}
              >
                About
              </MenuItem>
              <MenuItem
                _hover={{ bgColor: "purple.500" }}
                _focus={{ bgColor: "purple.500" }}
                color='red.500'
                fontWeight='semibold'
                icon={<VscSignOut size={20} />}
                onClick={() => {
                  signOut();
                  router.push("/");
                }}
              >
                Sign out
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </HStack>
      {children}
    </VStack>
  );
};

export default Navbar;
