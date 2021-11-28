import React from 'react';
import { useForm } from 'react-hook-form';
import { useWallet } from 'hooks';
import { Card, Button as ButtonShared } from 'components/common';
import { Button, Input, Stack, Box, FormLabel } from '@chakra-ui/react';
import { ethers } from 'ethers';

type DepositTokenSectionProps = {
  onDepositToken: (obj: any) => Promise<any>;
  isLoading?: boolean;
};

export type DepositTokenFormProps = {
  contractAddress: string;
  amount: string;
};

export function DepositTokenSection({
  onDepositToken,
  isLoading,
}: DepositTokenSectionProps): JSX.Element {
  const { isConnected, connectWallet } = useWallet();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<DepositTokenFormProps>({
    mode: 'onChange',
  });

  return (
    <Card
      light
      as="form"
      id="deposit-token"
      border="1px solid rgb(44, 47, 54)"
      onSubmit={handleSubmit(onDepositToken)}
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
                ethers.utils.isAddress(value),
            })}
            disabled={!isConnected}
          />
        </Box>
        <Box>
          <FormLabel htmlFor="amount">Deposit amount (base units):</FormLabel>
          <Input
            type="number"
            id="amount"
            placeholder="0.0"
            {...register('amount', {
              required: true,
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
            Deposit
          </ButtonShared>
        ) : (
          <Button onClick={connectWallet}>Connect to wallet</Button>
        )}
      </Stack>
    </Card>
  );
}
