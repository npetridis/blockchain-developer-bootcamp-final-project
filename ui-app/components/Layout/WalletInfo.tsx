import React from 'react';
import { Box, Button, ButtonProps, HStack, Text } from '@chakra-ui/react';
import { BigNumber, utils } from 'ethers';

const formatBalance = (balance: BigNumber = BigNumber.from(0)): string => {
  return utils.formatEther(balance).substring(0, 5);
};

const formatAddress = (address: string = '') => {
  const start = address.substring(0, 6);
  const end = address.substring(address.length - 4);
  return `${start}...${end}`;
};

type WalletInfoProps = {
  balance: BigNumber;
  address: string;
};

export function WalletInfo({ balance, address }: WalletInfoProps) {
  return (
    <HStack
      width="max-content"
      spacing="0.5em"
      background="background.light"
      justifySelf="end"
    >
      <Text>{formatBalance(balance)} ETH</Text>
      <Box>
        <Text>{formatAddress(address)}</Text>
      </Box>
    </HStack>
  );
}
