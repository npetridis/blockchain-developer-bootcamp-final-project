import React from 'react';
import { Box, FormLabel, Input, Stack } from '@chakra-ui/react';
import { Button } from 'components/common';
import { Item } from './Item';
import { useForm } from 'react-hook-form';

type BalanceOfProps = {
  onClick: (data: BalanceOfFormProps) => Promise<string>;
};

export type BalanceOfFormProps = {
  address: string;
};

export function BalanceOf({ onClick }: BalanceOfProps) {
  const [result, setResult] = React.useState('0.0');
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<BalanceOfFormProps>({
    mode: 'onChange',
  });

  const handleClick = async (formData: BalanceOfFormProps) => {
    const totalSupply = await onClick(formData);
    setResult(totalSupply);
  };

  return (
    <Item title="balanceOf">
      <Stack as="form" spacing="0.75em" onSubmit={handleSubmit(handleClick)}>
        <Box>
          <FormLabel htmlFor="address">Type account address:</FormLabel>
          <Input
            id="address"
            type="text"
            placeholder="0x0000...0000"
            {...register('address', { required: true })}
          />
        </Box>
        <Button w="full" type="submit" isDisabled={!!errors.address}>
          Get balance
        </Button>
        <Box>
          <FormLabel>Result:</FormLabel>
          <Input
            readOnly
            value={result}
            pointerEvents="none"
            borderColor="gray.600"
          />
        </Box>
      </Stack>
    </Item>
  );
}
