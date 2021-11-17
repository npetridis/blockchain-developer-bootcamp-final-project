import React from 'react';
import { useForm } from 'react-hook-form';
import { useWallet } from 'hooks';
import { Card, Button as ButtonShared } from 'components/common';
import { Button, Input, Stack, Box, FormLabel } from '@chakra-ui/react';
import { BigNumber, utils } from 'ethers';

type DepositSectionProps = {
  onDepositEther: (obj: any) => Promise<any>;
  isLoading?: boolean;
};

type DepositEtherFormProps = {
  etherAmount: string;
};

export function DepositSection({
  onDepositEther,
  isLoading,
}: DepositSectionProps): JSX.Element {
  const { isConnected, connectWallet } = useWallet();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<DepositEtherFormProps>({
    mode: 'onChange',
  });

  return (
    <Card
      light
      as="form"
      id="deposit"
      border="1px solid rgb(44, 47, 54)"
      onSubmit={handleSubmit(onDepositEther)}
    >
      <Stack spacing="1em">
        <Box>
          <FormLabel htmlFor="etherAmount">Deposit amount (ether):</FormLabel>
          <Input
            type="number"
            id="etherAmount"
            placeholder="0.0"
            {...register('etherAmount', {
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
            isDisabled={!!errors.etherAmount || !isDirty}
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
