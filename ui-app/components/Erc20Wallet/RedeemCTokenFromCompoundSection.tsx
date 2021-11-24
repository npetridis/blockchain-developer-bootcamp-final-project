import React from 'react';
import { useForm } from 'react-hook-form';
import { useWallet } from 'hooks';
import { Card, Button as ButtonShared } from 'components/common';
import { Button, Input, Stack, Box, FormLabel } from '@chakra-ui/react';

type RedeemCTokenFromCompoundSectionProps = {
  onRedeemCTokenFromCompound: (obj: RedeemCTokenFromCompoundFormProps) => Promise<any>;
  isLoading?: boolean;
};

export type RedeemCTokenFromCompoundFormProps = {
  cTokenAddress: string;
  amount: string;
};

export function RedeemCTokenFromCompoundSection({
  onRedeemCTokenFromCompound,
  isLoading,
}: RedeemCTokenFromCompoundSectionProps): JSX.Element {
  const { isConnected, connectWallet } = useWallet();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<RedeemCTokenFromCompoundFormProps>({
    mode: 'onChange',
  });

  const isDisabled = !!errors.amount || !!errors.cTokenAddress || !isDirty;

  return (
    <Card
      light
      as="form"
      id="deposit-token"
      border="1px solid rgb(44, 47, 54)"
      onSubmit={handleSubmit(onRedeemCTokenFromCompound)}
    >
      <Stack spacing="1em">
        <Box>
          <FormLabel htmlFor="cTokenAddress">CToken contract address (token to redeem):</FormLabel>
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
          <FormLabel htmlFor="amount">CToken amount to redeem:</FormLabel>
          <Input
            type="number"
            id="amount"
            placeholder="0.0"
            {...register('amount', {
              required: true,
              // validate: (value) =>
              //   utils.parseEther(value).gt(BigNumber.from(0)),
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
            Redeem
          </ButtonShared>
        ) : (
          <Button onClick={connectWallet}>Connect to wallet</Button>
        )}
      </Stack>
    </Card>
  );
}
