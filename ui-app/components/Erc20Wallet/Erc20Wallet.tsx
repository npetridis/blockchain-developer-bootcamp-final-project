import React from 'react';
import { useBlockNumber, useWallet } from 'hooks';
import { Card } from 'components/common';
import { Heading, Stack, useToast } from '@chakra-ui/react';
import { utils } from 'ethers';
import { DepositTokenSection } from './DepositTokenSection';
import { WithdrawTokenSection } from './WithdrawTokenSection';
import { useDefiVaultContract } from 'hooks/useDefiVaultContract';

type TokenInteraction = {
  tokenAddress: string;
  amount: string;
};

export function Erc20Wallet(): JSX.Element {
  const { ethBalance: walletEtherBalance } = useWallet();
  const { tokenBalances, depositToken, withdrawToken } = useDefiVaultContract(
    process.env.NEXT_PUBLIC_DEFI_VAULT_CONTRACT_ADDRESS as string
  );
  const toast = useToast();

  const handleDepositToken = async ({
    tokenAddress,
    amount,
  }: TokenInteraction) => {
    console.log(
      'Depositing Token',
      amount,
      utils.parseEther(amount),
      tokenAddress
    );

    try {
      const newBalance = await depositToken(
        tokenAddress,
        utils.parseEther(amount)
      );
      console.log('Deposit token balance', newBalance);
    } catch (err) {
      toast({
        title:
          err?.message ||
          err?.message ||
          err?.value ||
          'Something wrong happened!',
        status: 'error',
        isClosable: true,
      });
    }
  };

  const handleWithdrawEther = async ({
    tokenAddress,
    amount,
  }: TokenInteraction) => {
    console.log(
      'Withdrawing Token',
      amount,
      utils.parseEther(amount),
      tokenAddress
    );

    try {
      const newBalance = await withdrawToken(
        tokenAddress,
        utils.parseEther(amount)
      );
      console.log('withdraw token balance', newBalance);
    } catch (err) {
      toast({
        title:
          err?.message ||
          err?.message ||
          err?.value ||
          'Something wrong happened!',
        status: 'error',
        isClosable: true,
      });
    }
  };

  console.log('tokensBalance', tokenBalances);

  return (
    <Card maxWidth="500px">
      <Heading mb="4" fontSize="1.25em" color="text.regular">
        ERC20 Wallet
      </Heading>
      <Stack spacing="1em">
        <DepositTokenSection onDepositToken={handleDepositToken} />
        <WithdrawTokenSection onWithdrawToken={handleWithdrawEther} />
      </Stack>
    </Card>
  );
}
