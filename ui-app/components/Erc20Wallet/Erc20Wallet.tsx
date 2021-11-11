import React from 'react';
import { useToast } from 'hooks';
import { AddressCopy, Card } from 'components/common';
import { Heading, Stack } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import {
  DepositTokenSection,
  DepositTokenFormProps,
} from './DepositTokenSection';
import {
  WithdrawTokenSection,
  WithdrawTokenFormProps
} from './WithdrawTokenSection';
import { useDefiVaultContract } from 'hooks/useDefiVaultContract';

export function Erc20Wallet(): JSX.Element {
  const { tokenBalances, depositToken, withdrawToken } =
    useDefiVaultContract(
      process.env.NEXT_PUBLIC_DEFI_VAULT_CONTRACT_ADDRESS as string
    );
  const { successTransactionToast, errorToast } = useToast();

  const handleDepositToken = async ({
    contractAddress,
    amount,
  }: DepositTokenFormProps) => {
    try {
      const txData = await depositToken(
        contractAddress,
        BigNumber.from(amount)
      );
      successTransactionToast({ title: 'Deposit was successful!', txData });
    } catch (error) {
      errorToast({ error });
    }
  };

  const handleWithdrawEther = async ({
    contractAddress,
    amount,
  }: WithdrawTokenFormProps) => {
    try {
      const txData = await withdrawToken(
        contractAddress,
        BigNumber.from(amount)
      );
      successTransactionToast({ title: 'Withdrawal was successful!', txData });
    } catch (error) {
      errorToast({ error });
    }
  };

  return (
    <Card maxWidth="500px">
      <Heading mb="4" fontSize="1.25em" color="text.regular">
        ERC20 Wallet
      </Heading>
      <Stack spacing="1em">
        <Card light py='1em'>
          {tokenBalances?.map(({ address, balance, name, symbol }) => (
            <AddressCopy fullWidth addressDigits={6}
              key={address}
              label={`${name} (${symbol}): ${balance.toString()}`}
              address={address}
            />
          ))}
        </Card>
        <DepositTokenSection onDepositToken={handleDepositToken} />
        <WithdrawTokenSection onWithdrawToken={handleWithdrawEther} />
      </Stack>
    </Card>
  );
}
