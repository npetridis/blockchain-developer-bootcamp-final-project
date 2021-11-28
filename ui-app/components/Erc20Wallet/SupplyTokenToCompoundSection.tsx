import React from 'react';
import { useForm } from 'react-hook-form';
import { useWallet } from 'hooks';
import { Card, Button as ButtonShared } from 'components/common';
import { Button, Input, Stack, Box, FormLabel } from '@chakra-ui/react';
import { ethers } from 'ethers';

type SupplyTokenToCompoundSectionProps = {
  onSupplyTokenToCompound: (obj: SupplyTokenToCompoundFormProps) => Promise<any>;
  isLoading?: boolean;
};

export type SupplyTokenToCompoundFormProps = {
  tokenAddress: string;
  cTokenAddress: string;
  amount: string;
};

export function SupplyTokenToCompoundSection({
  onSupplyTokenToCompound,
  isLoading,
}: SupplyTokenToCompoundSectionProps): JSX.Element {
  const { isConnected, connectWallet } = useWallet();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<SupplyTokenToCompoundFormProps>({
    mode: 'onChange',
  });

  const isDisabled = !!errors.amount || !!errors.cTokenAddress || !!errors.tokenAddress || !isDirty;

  return (
    <Card
      light
      as="form"
      id="deposit-token"
      border="1px solid rgb(44, 47, 54)"
      onSubmit={handleSubmit(onSupplyTokenToCompound)}
    >
      <Stack spacing="1em">
        <Box>
          <FormLabel htmlFor="tokenAddress">ERC20 contract address to supply:</FormLabel>
          <Input
            type="text"
            id="tokenAddress"
            placeholder="0x0000...0000"
            {...register('tokenAddress', {
              required: true,
              validate: (value) =>
                ethers.utils.isAddress(value),
            })}
            disabled={!isConnected}
          />
        </Box>
        <Box>
          <FormLabel htmlFor="cTokenAddress">CToken contract address (minted token):</FormLabel>
          <Input
            type="text"
            id="cTokenAddress"
            placeholder="0x0000...0000"
            {...register('cTokenAddress', {
              required: true,
              // validate: (value) =>
              //   utils.parseEther(value).gt(BigNumber.from(0)),
            })}
            disabled={!isConnected}
          />
        </Box>
        <Box>
          <FormLabel htmlFor="amount">ERC20 token amount to supply (base units):</FormLabel>
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
            isDisabled={isDisabled}
          >
            Supply
          </ButtonShared>
        ) : (
          <Button onClick={connectWallet}>Connect to wallet</Button>
        )}
      </Stack>
    </Card>
  );
}
