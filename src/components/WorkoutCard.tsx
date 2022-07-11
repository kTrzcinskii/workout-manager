import { Text, VStack, chakra } from "@chakra-ui/react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

interface WorkoutCardProps {
  title: string;
  id: string;
  createdAt: Date;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ title, id, createdAt }) => {
  const createdAtTransformed = format(createdAt, "do MMMM yyyy");
  const router = useRouter();
  return (
    <VStack
      w='full'
      bgColor='gray.50'
      cursor='pointer'
      _hover={{
        transform: "scale(105%)",
      }}
      transition='ease-in-out'
      transitionDuration='200ms'
      px={8}
      py={6}
      rounded='lg'
      onClick={() => router.push(`/workout/${id}`)}
      as={motion.div}
      variants={{
        hidden: {
          opacity: 0,
        },
        visible: {
          opacity: 1,
          transition: { ease: "easeInOut", duration: 0.2 },
        },
      }}
      initial='hidden'
      animate='visible'
    >
      <Text color='purple.500' fontSize='2xl' fontWeight='semibold'>
        {title}
      </Text>
      <Text color='gray.600' fontSize='md'>
        Created on{" "}
        <chakra.span color='black' fontWeight='semibold'>
          {createdAtTransformed}
        </chakra.span>
      </Text>
    </VStack>
  );
};

export default WorkoutCard;
