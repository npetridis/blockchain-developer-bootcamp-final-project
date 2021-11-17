import React from 'react';
import { useForm } from 'react-hook-form';
import { useWallet } from 'hooks';
import { Card } from 'components/common';
import { Button, Input, Stack, Box, FormLabel } from '@chakra-ui/react';
import { BigNumber, utils } from 'ethers';

type WithdrawSectionProps = {
  onWithdrawEther: (obj: any) => Promise<any>;
  isLoading?: boolean;
};

type WithdrawEtherFormProps = {
  etherAmount: string;
};

export function WithdrawSection({
  onWithdrawEther,
  isLoading,
}: WithdrawSectionProps): JSX.Element {
  const { isConnected, connectWallet } = useWallet();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<WithdrawEtherFormProps>();

  return (
    <Card
      light
      as="form"
      id="withdraw"
      border="1px solid rgb(44, 47, 54)"
      onSubmit={handleSubmit(onWithdrawEther)}
    >
      <Stack spacing="1em">
        <Box>
          <FormLabel htmlFor="etherAmount">Withdraw amount (ether):</FormLabel>
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
          <Button
            bg="background.light"
            color="text.regular"
            type="submit"
            _hover={{ color: 'text.dark', bg: 'background.white' }}
            isDisabled={!!errors.etherAmount || !isDirty}
          >
            Withdraw
          </Button>
        ) : (
          <Button onClick={connectWallet}>Connect to wallet</Button>
        )}
      </Stack>
    </Card>
  );
}
