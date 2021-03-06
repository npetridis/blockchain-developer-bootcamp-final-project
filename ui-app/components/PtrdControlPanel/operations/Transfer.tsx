import React from 'react';
import { Box, FormLabel, Input, Stack } from '@chakra-ui/react';
import { Button } from 'components/common';
import { Item } from './Item';
import { useForm } from 'react-hook-form';
import { useWallet } from 'hooks/useWallet';
import { ethers } from 'ethers';

type TransferProps = {
  onClick: (formData: TransferFormProps) => void;
};

export type TransferFormProps = {
  recipient: string;
  amount: string;
};

export function Transfer({ onClick }: TransferProps) {
  const { isConnected, connectWallet } = useWallet();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<TransferFormProps>({
    mode: 'onChange',
  });

  return (
    <Item title="transfer">
      <Stack as="form" spacing="0.75em" onSubmit={handleSubmit(onClick)}>
        <Box>
          <FormLabel htmlFor="recipient">Type recipient address:</FormLabel>
          <Input
            id="recipient"
            type="text"
            placeholder="0x0000...0000"
            {...register('recipient', { 
              required: true,
              validate: (value) =>
                ethers.utils.isAddress(value) 
            })}
          />
        </Box>
        <Box>
          <FormLabel htmlFor="amount">Type token amount to transfer (base units):</FormLabel>
          <Input
            id="amount"
            type="number"
            placeholder="0.0"
            step="any"
            {...register('amount', {
              required: true,
            })}
          />
        </Box>
        {isConnected ? (
          <Button
            w="full"
            type="submit"
            isDisabled={!!errors.recipient || !!errors.amount}
          >
            Transfer
          </Button>
        ) : (
          <Button onClick={connectWallet}>Connect to wallet</Button>
        )}
      </Stack>
    </Item>
  );
}
