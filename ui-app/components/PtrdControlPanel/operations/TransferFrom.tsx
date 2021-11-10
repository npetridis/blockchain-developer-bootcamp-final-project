import React from 'react';
import { Box, FormLabel, Input, Stack } from '@chakra-ui/react';
import { Button } from 'components/common';
import { Item } from './Item';
import { useForm } from 'react-hook-form';
import { BigNumber, utils } from 'ethers';
import { useWallet } from 'hooks/useWallet';

type TransferFromProps = {
  onClick: (data: TransferFromFormProps) => {};
};

export type TransferFromFormProps = {
  sender: string;
  recipient: string;
  amount: string;
};

export function TransferFrom({ onClick }: TransferFromProps) {
  const { isConnected, connectWallet } = useWallet();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<TransferFromFormProps>({
    mode: 'onChange',
  });

  return (
    <Item title="transferFrom">
      <Stack as="form" spacing="0.75em" onSubmit={handleSubmit(onClick)}>
        <Box>
          <FormLabel htmlFor="sender">Type sender address:</FormLabel>
          <Input
            id="sender"
            type="text"
            placeholder="0x0000...0000"
            {...register('sender', { required: true })}
          />
        </Box>
        <Box>
          <FormLabel htmlFor="recipient">Type recipient address:</FormLabel>
          <Input
            id="recipient"
            type="text"
            placeholder="0x0000...0000"
            {...register('recipient', { required: true })}
          />
        </Box>
        <Box>
          <FormLabel htmlFor="amount">Type token amount to transfer:</FormLabel>
          <Input
            id="amount"
            type="number"
            placeholder="0.0"
            step="0.01"
            {...register('amount', {
              required: true,
              validate: (value) =>
                utils.parseEther(value).gt(BigNumber.from(0)),
            })}
          />
        </Box>
        {isConnected ? (
          <Button
            w="full"
            type="submit"
            isDisabled={!!errors.recipient || !!errors.sender}
          >
            Transfer From
          </Button>
        ) : (
          <Button onClick={connectWallet}>Connect to wallet</Button>
        )}
      </Stack>
    </Item>
  );
}
