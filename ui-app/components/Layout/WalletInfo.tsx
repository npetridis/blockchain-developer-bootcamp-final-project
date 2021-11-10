import React from 'react';
import { Box, Button, ButtonProps, HStack, Text } from '@chakra-ui/react';
import { BigNumber, utils } from 'ethers';
import { formatAddress } from 'utils';

const formatEtherBalance = (balance: BigNumber = BigNumber.from(0)): string => {
  return utils.formatEther(balance).substring(0, 5);
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
      <Text>{formatEtherBalance(balance)} ETH</Text>
      <Box>
        <Text>{formatAddress(address)}</Text>
      </Box>
    </HStack>
  );
}
