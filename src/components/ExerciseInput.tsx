import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  InputProps,
  VStack,
  Heading,
  Button,
} from "@chakra-ui/react";
import { Dispatch, InputHTMLAttributes, SetStateAction, useState } from "react";
import { UseFieldArrayRemove } from "react-hook-form";

interface ExerciseInputProps {
  index: number;
  errors: any;
  register: any;
  remove: UseFieldArrayRemove;
  id: any;
}

type SingleExerciseInputProps = InputHTMLAttributes<HTMLInputElement> &
  InputProps & {
    label?: string;
    registerName: string;
    setMainFocus: Dispatch<SetStateAction<boolean>>;
    index: number;
    errors: any;
    register: any;
  };
const SignleExerciseInput: React.FC<SingleExerciseInputProps> = ({
  index,
  errors,
  label,
  registerName,
  setMainFocus,
  register,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <FormControl
      isInvalid={errors?.exercises?.[index]?.[registerName]}
      width='full'
    >
      {label && (
        <FormLabel
          htmlFor={`exercises.${index}.${registerName}`}
          color={isFocused ? "purple.400" : "white"}
        >
          {label}
        </FormLabel>
      )}
      <Input
        id={`exercises.${index}.${registerName}`}
        {...register(`exercises.${index}.${registerName}` as const)}
        {...props}
        borderWidth={2}
        color='white'
        _placeholder={{ color: "gray.300" }}
        focusBorderColor='purple.400'
        borderColor='white'
        _hover={{}}
        name={`exercises.${index}.${registerName}`}
        onFocus={() => {
          setIsFocused(true);
          setMainFocus(true);
        }}
        onBlur={() => {
          setIsFocused(false);
          setMainFocus(false);
        }}
      />
      <FormErrorMessage>
        {errors?.exercises?.[index]?.[registerName] &&
          errors?.exercises?.[index]?.[registerName]?.message}
      </FormErrorMessage>
    </FormControl>
  );
};

const ExerciseInput: React.FC<ExerciseInputProps> = ({
  index,
  errors,
  register,
  remove,
  id,
}) => {
  const [mainFocus, setMainFocus] = useState(false);
  return (
    <VStack
      w='full'
      spacing={{ base: 3, md: 4, lg: 6 }}
      borderWidth={2}
      borderColor={mainFocus ? "purple.400" : "white"}
      px={4}
      py={3}
      rounded='lg'
      key={id}
    >
      <Heading color='purple.400' fontSize={{ base: "2xl", md: "3xl" }}>
        Exercise number {index + 1}
      </Heading>
      <SignleExerciseInput
        errors={errors}
        register={register}
        index={index}
        label='Exercise Title'
        registerName='title'
        placeholder='Enter exercise title'
        setMainFocus={setMainFocus}
      />
      <SignleExerciseInput
        errors={errors}
        register={register}
        index={index}
        label='Series'
        registerName='series'
        placeholder='Enter number of series'
        type='number'
        setMainFocus={setMainFocus}
      />
      <SignleExerciseInput
        errors={errors}
        register={register}
        index={index}
        label='Reps in one Series'
        registerName='repsInOneSeries'
        placeholder='Enter number of reps in one Series'
        type='number'
        setMainFocus={setMainFocus}
      />
      <SignleExerciseInput
        errors={errors}
        register={register}
        index={index}
        label='Weight (optional)'
        registerName='weight'
        placeholder='Enter weight'
        type='number'
        setMainFocus={setMainFocus}
      />
      <Input
        id={`exercises.${index}.index`}
        {...register(`exercises.${index}.index` as const)}
        name={`exercises.${index}.index`}
        display='none'
        value={index}
      />
      <Button colorScheme='red' onClick={() => remove(index)}>
        Delete Exercise
      </Button>
    </VStack>
  );
};

export default ExerciseInput;
