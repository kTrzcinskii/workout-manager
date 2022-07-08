import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
  InputProps,
} from "@chakra-ui/react";
import { InputHTMLAttributes, ReactNode, useRef, useState } from "react";

type FormInputProps = InputHTMLAttributes<HTMLInputElement> &
  InputProps & {
    label?: string;
    errors: any;
    register: any;
    icon?: ReactNode;
    registerName: string;
  };

const FormInput: React.FC<FormInputProps> = ({
  label,
  errors,
  register,
  icon,
  registerName,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <FormControl isInvalid={errors.name} width='full'>
      {label && (
        <FormLabel
          htmlFor={registerName}
          color={isFocused ? "purple.400" : "white"}
        >
          {label}
        </FormLabel>
      )}
      <InputGroup>
        {icon && <InputLeftElement>{icon}</InputLeftElement>}
        <Input
          id={registerName}
          {...register(registerName)}
          {...props}
          borderWidth={2}
          color='white'
          _placeholder={{ color: "gray.300" }}
          focusBorderColor='purple.400'
          borderColor='white'
          _hover={{}}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          name={registerName}
        />
      </InputGroup>
      <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
    </FormControl>
  );
};

export default FormInput;
