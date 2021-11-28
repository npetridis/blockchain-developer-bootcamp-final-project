import React from 'react';
import { useForm } from 'react-hook-form';
import { useWallet } from 'hooks';
import { Card, Button as ButtonShared } from 'components/common';
import { Button, Input, Stack, Box, FormLabel } from '@chakra-ui/react';
import { BigNumber, ethers, utils } from 'ethers';

type WithdrawTokenSectionProps = {
  onWithdrawToken: (obj: any) => Promise<any>;
  isLoading?: boolean;
};

export type WithdrawTokenFormProps = {
  contractAddress: string;
  amount: string;
};

export function WithdrawTokenSection({
  onWithdrawToken,
  isLoading,
}: WithdrawTokenSectionProps): JSX.Element {
  const { isConnected, connectWallet } = useWallet();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<WithdrawTokenFormProps>({
    mode: 'onChange',
  });

  return (
    <Card
      light
      as="form"
      id="withdraw-token"
      border="1px solid rgb(44, 47, 54)"
      onSubmit={handleSubmit(onWithdrawToken)}
    >
      <Stack spacing="1em">
        <Box>
          <FormLabel htmlFor="contractAddress">ERC20 contract address:</FormLabel>
          <Input
            type="text"
            id="contractAddress"
            placeholder="0x0000...0000"
            {...register('contractAddress', {
              required: true,
              validate: (value) =>
                ethers.utils.isAddress(value)
            })}
            disabled={!isConnected}
          />
        </Box>
        <Box>
          <FormLabel htmlFor="amount">Withdraw amount (base units):</FormLabel>
          <Input
            type="number"
            id="amount"
            placeholder="0.0"
            {...register('amount', {
              required: true,
              validate: (value) =>
                utils.parseEther(value).gt(BigNumber.from(0)),
            })}
            disabled={!isConnected}
            step="any"
          />
        </Box>
        {isConnected ? (
          <ButtonShared
            type="submit"
            isDisabled={!!errors.amount || !!errors.contractAddress || !isDirty}
          >
            Withdraw
          </ButtonShared>
        ) : (
          <Button onClick={connectWallet}>Connect to wallet</Button>
        )}
      </Stack>
    </Card>
  );
}
