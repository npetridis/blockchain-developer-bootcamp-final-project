import React from 'react';
import { useBlockNumber, useWallet, useEtherWalletContract, useEnvVars, useToast } from 'hooks';
import { Card } from 'components/common';
import { Text, Heading, Stack } from '@chakra-ui/react';
import { utils } from 'ethers';
import { DepositSection } from './DepositSection';
import { WithdrawSection } from './WithdrawSection';

type EtherAmount = {
  etherAmount: string;
};

export function EtherWallet(): JSX.Element {
  const { defiVaultContractAddress } = useEnvVars();
  const { ethBalance: walletEtherBalance } = useWallet();
  const { blockNumber } = useBlockNumber();
  const {
    depositEther,
    withdrawEther,
    etherBalance: contractEtherBalance,
  } = useEtherWalletContract(defiVaultContractAddress);
  const { successConfirmationToast, errorToast } = useToast();


  const handleDepositEther = async ({ etherAmount }: EtherAmount) => {
    console.log('Depositing Ether', etherAmount, typeof etherAmount);

    try {
      const txData = await depositEther(utils.parseEther(etherAmount));
      successConfirmationToast({ title: 'Withdrawal was successful!', txData });
    } catch (error) {
      errorToast({ error });
    }
  };

  const handleWithdrawEther = async ({ etherAmount }: EtherAmount) => {
    console.log('Withdrawing Ether', etherAmount, typeof etherAmount);

    try {
      const txData = await withdrawEther(utils.parseEther(etherAmount));
      successConfirmationToast({ title: 'Withdrawal was successful!', txData });
    } catch (error) {
      errorToast({ error });
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
            Wallet deposits: {utils.formatEther(contractEtherBalance)}
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
