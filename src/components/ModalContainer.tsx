import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { ReactNode } from "react";

interface ModalContainerProps {
  isOpen: boolean;
  onClose: () => void;
  header: string;
  body: ReactNode;
  footer: ReactNode;
  showCloseBtn?: boolean;
  closeOnClickOnOverlay?: boolean;
}

const ModalContainer: React.FC<ModalContainerProps> = ({
  isOpen,
  onClose,
  header,
  body,
  footer,
  showCloseBtn = true,
  closeOnClickOnOverlay = true,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered={true}
      closeOnOverlayClick={closeOnClickOnOverlay}
      closeOnEsc={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color='purple.500'>{header}</ModalHeader>
        {showCloseBtn && <ModalCloseButton />}
        <ModalBody>{body}</ModalBody>
        <ModalFooter>{footer}</ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalContainer;
