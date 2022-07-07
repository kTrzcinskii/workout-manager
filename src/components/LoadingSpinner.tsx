import { Flex, Spinner } from "@chakra-ui/react";

const LoadingSpinner: React.FC = () => {
  return (
    <Flex w='full' pt={20} justifyContent='center' alignItems='center'>
      <Spinner
        color='purple.500'
        boxSize={40}
        thickness='4px'
        emptyColor='gray.700'
        speed='1s'
      />
    </Flex>
  );
};

export default LoadingSpinner;
