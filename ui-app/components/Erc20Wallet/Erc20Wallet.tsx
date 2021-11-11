import React from 'react';
import { useToast } from 'hooks';
import { Card } from 'components/common';
import { Flex, Heading, Stack, Text } from '@chakra-ui/react';
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
import { formatAddress } from 'utils';

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
            <Flex key={address} justify='space-between'>
              <Text>
                {`${name} (${symbol}): ${balance.toString()}`}
              </Text>
              <Text>
                {`${formatAddress(address, 10)}`}
              </Text>
            </Flex>
          ))}
        </Card>
        <DepositTokenSection onDepositToken={handleDepositToken} />
        <WithdrawTokenSection onWithdrawToken={handleWithdrawEther} />
      </Stack>
    </Card>
  );
}
