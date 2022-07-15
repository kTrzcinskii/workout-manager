import { useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { EditBtn } from "./EditBtn";
import ModalEditInput from "./ModalEditInput";
import ModalContainer from "./ModalContainer";
import ModalFormBtnContainer from "./ModalFormBtnContainer";

interface EditContainerProps {
  ariaLabel: string;
  header: string;
  fontSize?: string;
  formId: string;
  btnText: string;
  defaultValue: string;
  workoutId: string;
  field: "title" | "description" | "breakDuration";
}

const EditContainer: React.FC<EditContainerProps> = ({
  ariaLabel,
  header,
  formId,
  btnText,
  fontSize = "2xl",
  defaultValue,
  workoutId,
  field,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <>
      <EditBtn onClick={onOpen} ariaLabel={ariaLabel} fontSize={fontSize} />
      <ModalContainer
        header={header}
        body={
          <ModalEditInput
            defaultValue={defaultValue}
            workoutId={workoutId}
            setIsSubmitting={setIsSubmitting}
            onClose={onClose}
            field={field}
          />
        }
        footer={
          <ModalFormBtnContainer
            formId={formId}
            btnText={btnText}
            onClose={onClose}
            isSubmitting={isSubmitting}
          />
        }
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
};

export default EditContainer;
