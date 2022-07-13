import { useDisclosure } from "@chakra-ui/react";
import { ReactNode } from "react";
import { EditBtn } from "./EditBtn";
import ModalContainer from "./ModalContainer";

interface EditContainerProps {
  ariaLabel: string;
  header: string;
  body: ReactNode;
  footer: ReactNode;
  fontSize?: string;
}

const EditContainer: React.FC<EditContainerProps> = ({
  ariaLabel,
  header,
  body,
  footer,
  fontSize = "2xl",
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <EditBtn onClick={onOpen} ariaLabel={ariaLabel} fontSize={fontSize} />
      <ModalContainer
        header={header}
        body={body}
        footer={footer}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
};

export default EditContainer;
