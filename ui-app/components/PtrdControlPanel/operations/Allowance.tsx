import React from 'react';
import { Box, FormLabel, Input, Stack } from '@chakra-ui/react';
import { Button } from 'components/common';
import { Item } from './Item';
import { useForm } from 'react-hook-form';
import { ethers } from 'ethers';

type AllowanceProps = {
  onClick: (data: AllowanceFormProps) => Promise<string>;
};

export type AllowanceFormProps = {
  ownerAddress: string;
  spenderAddress: string;
};

export function Allowance({ onClick }: AllowanceProps) {
  const [result, setResult] = React.useState('0.0');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AllowanceFormProps>({
    mode: 'onChange',
  });

  const handleClick = async (formData: AllowanceFormProps) => {
    const allowance = await onClick(formData);
    setResult(allowance);
  };

  return (
    <Item title="allowance">
      <Stack as="form" spacing="0.75em" onSubmit={handleSubmit(handleClick)}>
        <Box>
          <FormLabel htmlFor="ownerAddress">Type owner address:</FormLabel>
          <Input
            id="ownerAddress"
            type="text"
            placeholder="0x0000...0000"
            {...register('ownerAddress', { 
              required: true,
              validate: (value) =>
                ethers.utils.isAddress(value) 
              })}
          />
        </Box>
        <Box>
          <FormLabel htmlFor="spenderAddress">Type spender address:</FormLabel>
          <Input
            id="spenderAddress"
            type="text"
            placeholder="0x0000...0000"
            {...register('spenderAddress', { 
              required: true,
              validate: (value) =>
                ethers.utils.isAddress(value) 
            })}
          />
        </Box>
        <Button
          w="full"
          type="submit"
          isDisabled={!!errors.ownerAddress || !!errors.spenderAddress}
        >
          Get Allowance
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
