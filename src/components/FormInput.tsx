import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputProps,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { InputHTMLAttributes, useState } from "react";

type FormInputProps = InputHTMLAttributes<HTMLInputElement> &
  InputProps & {
    label?: string;
    errors: any;
    register: any;
    registerName: string;
    isNumberInput?: boolean;
    minValue?: number;
    maxValue?: number;
    variant?: "gray.800" | "white";
  };

const FormInput: React.FC<FormInputProps> = ({
  label,
  errors,
  register,
  registerName,
  isNumberInput = false,
  minValue,
  variant = "white",
  maxValue,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <FormControl isInvalid={errors[registerName]} width='full'>
      {label && (
        <FormLabel
          htmlFor={registerName}
          color={isFocused ? "purple.400" : variant}
        >
          {label}
        </FormLabel>
      )}
      {isNumberInput ? (
        <NumberInput
          focusBorderColor='purple.400'
          min={minValue}
          max={maxValue}
        >
          <NumberInputField
            id={registerName}
            {...register(registerName)}
            {...props}
            borderWidth={2}
            color={variant}
            _placeholder={{ color: "gray.300" }}
            focusBorderColor='purple.400'
            borderColor={variant}
            _hover={{}}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            name={registerName}
          />
        </NumberInput>
      ) : (
        <Input
          id={registerName}
          {...register(registerName)}
          {...props}
          borderWidth={2}
          color={variant}
          _placeholder={{ color: "gray.300" }}
          focusBorderColor='purple.400'
          borderColor={variant}
          _hover={{}}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          name={registerName}
        />
      )}
      <FormErrorMessage>
        {errors[registerName] && errors[registerName].message}
      </FormErrorMessage>
    </FormControl>
  );
};

export default FormInput;
