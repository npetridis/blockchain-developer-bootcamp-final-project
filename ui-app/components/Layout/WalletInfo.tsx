import React from 'react';
import { HStack, Tag } from '@chakra-ui/react';
import { BigNumber, utils } from 'ethers';
import { formatAddress } from 'utils';

const formatEtherBalance = (balance: BigNumber = BigNumber.from(0)): string => {
  return utils.formatEther(balance).substring(0, 5);
};

type WalletInfoProps = {
  balance: BigNumber;
  address: string | undefined;
};

export function WalletInfo({ balance, address }: WalletInfoProps) {
  if (!address) {
    return null;
  }

  return (
    <HStack
      width="max-content"
      spacing="0.5em"
      justifySelf="end"
      zIndex="2"
    >
      <Tag size='lg' color="text.regular" bg='background.light'>{formatEtherBalance(balance)} ETH</Tag>
      <Tag size='lg' color="text.regular" bg='background.dark'>{formatAddress(address, 8)}</Tag>
    </HStack>
  );
}
