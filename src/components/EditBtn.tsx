import { EditIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";

interface EditBtnProps {
  onClick: () => void;
  fontSize?: string;
  variant?: "purple" | "white";
  ariaLabel: string;
}

export const EditBtn: React.FC<EditBtnProps> = ({
  onClick,
  fontSize = "2xl",
  variant = "purple",
  ariaLabel,
}) => {
  const main = variant === "purple" ? "purple.500" : "white";
  const second = variant === "purple" ? "white" : "purple.500";

  return (
    <IconButton
      aria-label={ariaLabel}
      icon={<EditIcon />}
      color={main}
      fontSize={fontSize}
      variant='ghost'
      _hover={{
        bgColor: main,
        color: second,
      }}
      onClick={onClick}
    />
  );
};
