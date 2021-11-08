import React from 'react';
import { useBlockNumber, useWallet, useEtherWalletContract } from 'hooks';
import { Card } from 'components/common';
import { Text, Heading, Stack, useToast } from '@chakra-ui/react';
import { utils } from 'ethers';
import { DepositSection } from './DepositSection';
import { WithdrawSection } from './WithdrawSection';

type EtherAmount = {
  etherAmount: string;
};

export function EtherWallet(): JSX.Element {
  const { ethBalance: walletEtherBalance } = useWallet();
  const { blockNumber } = useBlockNumber();
  const {
    depositEther,
    withdrawEther,
    etherBalance: contractEtherBalance,
  } = useEtherWalletContract(
    process.env.NEXT_PUBLIC_DEFI_VAULT_CONTRACT_ADDRESS as string
  );
  const toast = useToast();

  const handleDepositEther = async ({ etherAmount }: EtherAmount) => {
    console.log('Depositing Ether', etherAmount, typeof etherAmount);

    try {
      const newBalance = await depositEther(utils.parseEther(etherAmount));
      console.log('Deposit Ether', newBalance);
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

  const handleWithdrawEther = async ({ etherAmount }: EtherAmount) => {
    console.log('Withdrawing Ether', etherAmount, typeof etherAmount);

    try {
      const newBalance = await withdrawEther(utils.parseEther(etherAmount));
      console.log('withdraw tx balance', newBalance);
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

  return (
    <Card maxWidth="500px">
      <Heading mb="4" fontSize="1.25em" color="text.regular">
        Ether Wallet
      </Heading>
      <Stack spacing="1em">
        <Card light>
          <Text>
            Contract Balance: {utils.formatEther(contractEtherBalance)}
          </Text>
          <Text>Metamask balance: {utils.formatEther(walletEtherBalance)}</Text>
          <Text>Block number: {blockNumber}</Text>
        </Card>
        <DepositSection onDepositEther={handleDepositEther} />
        <WithdrawSection onWithdrawEther={handleWithdrawEther} />
      </Stack>
    </Card>
  );
}
