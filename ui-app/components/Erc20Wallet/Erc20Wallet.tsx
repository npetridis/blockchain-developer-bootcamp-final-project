import React from 'react';
import { useEnvVars, useToast } from 'hooks';
import { AddressCopy, Card } from 'components/common';
import { Heading, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import {
  DepositTokenSection,
  DepositTokenFormProps,
} from './DepositTokenSection';
import {
  WithdrawTokenSection,
  WithdrawTokenFormProps
} from './WithdrawTokenSection';
import {
  SupplyTokenToCompoundSection,
  SupplyTokenToCompoundFormProps
} from './SupplyTokenToCompoundSection';
import {
  RedeemCTokenFromCompoundSection,
  RedeemCTokenFromCompoundFormProps
} from './RedeemCTokenFromCompoundSection';
import { useDefiVaultContract } from 'hooks/useDefiVaultContract';

export function Erc20Wallet(): JSX.Element {
  const { defiVaultContractAddress } = useEnvVars();
  const { tokenBalances, depositToken, withdrawToken, supplyTokenToCompound, redeemTokenFromCompound } =
    useDefiVaultContract(defiVaultContractAddress);
  const { successConfirmationToast, errorToast } = useToast();

  const handleDepositToken = async ({
    contractAddress,
    amount,
  }: DepositTokenFormProps) => {
    try {
      const txData = await depositToken(
        contractAddress,
        BigNumber.from(amount)
      );
      successConfirmationToast({ title: 'Deposit was successful!', txData });
    } catch (error: any) {
      errorToast({ error });
    }
  };

  const handleWithdrawToken = async ({
    contractAddress,
    amount,
  }: WithdrawTokenFormProps) => {
    try {
      const txData = await withdrawToken(
        contractAddress,
        BigNumber.from(amount)
      );
      successConfirmationToast({ title: 'Withdrawal was successful!', txData });
    } catch (error: any) {
      errorToast({ error });
    }
  };

  const handleSupplyToken = async ({
    tokenAddress,
    cTokenAddress,
    amount,
  }: SupplyTokenToCompoundFormProps) => {
    try {
      const txData = await supplyTokenToCompound(
        tokenAddress,
        cTokenAddress,
        BigNumber.from(amount)
      );
      successConfirmationToast({ title: 'Token supply was successful!', txData });
    } catch (error: any) {
      errorToast({ error });
    }
  };

  const handleRedeemCToken = async ({
    cTokenAddress,
    amount,
  }: RedeemCTokenFromCompoundFormProps) => {
    try {
      const txData = await redeemTokenFromCompound(
        BigNumber.from(amount),
        cTokenAddress
      );
      successConfirmationToast({ title: 'CToken redemption was successful!', txData });
    } catch (error: any) {
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
          {!tokenBalances?.length ? (
            <Text>The wallet is empty</Text>
          ) : null}
        </Card>

        <Tabs variant="soft-rounded" colorScheme='orange' >
          <TabList>
            <Tab>Wallet</Tab>
            <Tab>Invest with Compound</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Stack spacing="1em">
                <DepositTokenSection onDepositToken={handleDepositToken} />
                <WithdrawTokenSection onWithdrawToken={handleWithdrawToken} />
              </Stack>
            </TabPanel>
            <TabPanel>
              <Stack spacing="1em">
                <SupplyTokenToCompoundSection onSupplyTokenToCompound={handleSupplyToken} />
                <RedeemCTokenFromCompoundSection onRedeemCTokenFromCompound={handleRedeemCToken} />
              </Stack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Card>
  );
}
