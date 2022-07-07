import { Heading, Text, VStack } from "@chakra-ui/react";

interface ErrorMessageProps {
  customMessage?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  customMessage = "Server does not respond.",
}) => {
  return (
    <VStack
      minH='100vh'
      w='full'
      justifyContent='center'
      alignItems='center'
      bgColor='gray.800'
      spacing={6}
    >
      <Heading color='purple.500' fontSize='5xl'>
        Error
      </Heading>
      <Text color='white' fontSize='xl'>
        {customMessage}
      </Text>
    </VStack>
  );
};

export default ErrorMessage;
