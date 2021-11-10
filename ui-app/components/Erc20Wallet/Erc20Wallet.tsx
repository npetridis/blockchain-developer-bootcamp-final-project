import React from 'react';
import { useToast, useWallet } from 'hooks';
import { Button, Card } from 'components/common';
import { Heading, Stack, Text } from '@chakra-ui/react';
import { BigNumber, utils } from 'ethers';
import {
  DepositTokenSection,
  DepositTokenFormProps,
} from './DepositTokenSection';
import { WithdrawTokenSection } from './WithdrawTokenSection';
import { useDefiVaultContract } from 'hooks/useDefiVaultContract';
import { formatAddress } from 'utils';

type TokenInteraction = {
  tokenAddress: string;
  amount: string;
};

export function Erc20Wallet(): JSX.Element {
  const { ethBalance: walletEtherBalance } = useWallet();
  const { tokenBalances, depositToken, withdrawToken, getTokens } =
    useDefiVaultContract(
      process.env.NEXT_PUBLIC_DEFI_VAULT_CONTRACT_ADDRESS as string
    );
  const { successTransactionToast, errorToast } = useToast();

  const handleDepositToken = async ({
    contractAddress,
    amount,
  }: DepositTokenFormProps) => {
    console.log(
      'Depositing Token',
      amount,
      BigNumber.from(amount).toString(),
      contractAddress
    );

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
    tokenAddress,
    amount,
  }: TokenInteraction) => {
    console.log(
      'Withdrawing Token',
      amount,
      BigNumber.from(amount),
      tokenAddress
    );

    try {
      const newBalance = await withdrawToken(
        tokenAddress,
        BigNumber.from(amount)
      );
      console.log('withdraw token balance', newBalance);
    } catch (error) {
      errorToast({ error });
    }
  };

  const handleGetTokens = async () => {
    try {
      const txData = await getTokens();
      successTransactionToast({ title: 'Operation was successful!' });
    } catch (error) {
      errorToast({ error });
    }
  };

  console.log('tokensBalance', tokenBalances);

  return (
    <Card maxWidth="500px">
      <Heading mb="4" fontSize="1.25em" color="text.regular">
        ERC20 Wallet
      </Heading>
      <Stack spacing="1em">
        <Button onClick={handleGetTokens}>Get tokens</Button>
        {tokenBalances?.map(({ address, balance }) => (
          <Text key={address}>
            {formatAddress(address)}: {balance.toString()}
          </Text>
        ))}
        <DepositTokenSection onDepositToken={handleDepositToken} />
        <WithdrawTokenSection onWithdrawToken={handleWithdrawEther} />
      </Stack>
    </Card>
  );
}
