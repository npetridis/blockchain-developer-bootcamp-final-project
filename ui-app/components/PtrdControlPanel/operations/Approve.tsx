import React from 'react';
import { Box, FormLabel, Input, Stack } from '@chakra-ui/react';
import { Button } from 'components/common';
import { Item } from './Item';
import { useForm } from 'react-hook-form';
import { BigNumber, utils } from 'ethers';
import { useWallet } from 'hooks/useWallet';

type ApproveProps = {
  onClick: (data: ApproveFormProps) => {};
};

export type ApproveFormProps = {
  address: string;
  amount: string;
};

export function Approve({ onClick }: ApproveProps) {
  const { isConnected, connectWallet } = useWallet();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<ApproveFormProps>({
    mode: 'onChange',
  });

  return (
    <Item title="approve">
      <Stack as="form" spacing="0.75em" onSubmit={handleSubmit(onClick)}>
        <Box>
          <FormLabel htmlFor="address">Type spender address:</FormLabel>
          <Input
            id="address"
            type="text"
            placeholder="0x0000...0000"
            {...register('address', { required: true })}
          />
        </Box>
        <Box>
          <FormLabel htmlFor="amount">Type token amount to approve:</FormLabel>
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
          <Button w="full" type="submit" isDisabled={!!errors.address}>
            Approve
          </Button>
        ) : (
          <Button onClick={connectWallet}>Connect to wallet</Button>
        )}
      </Stack>
    </Item>
  );
}
