import { Button, HStack } from "@chakra-ui/react";

interface ModalFormBtnContainerProps {
  onClose: () => void;
  isSubmitting: boolean;
  formId: string;
  btnText: string;
}

const ModalFormBtnContainer: React.FC<ModalFormBtnContainerProps> = ({
  onClose,
  isSubmitting,
  formId,
  btnText,
}) => {
  return (
    <HStack w='full' justifyContent='space-around'>
      <Button
        type='submit'
        form={formId}
        isLoading={isSubmitting}
        loadingText={btnText}
        colorScheme='purple'
      >
        {btnText}
      </Button>
      <Button onClick={onClose}>Cancel</Button>
    </HStack>
  );
};

export default ModalFormBtnContainer;
