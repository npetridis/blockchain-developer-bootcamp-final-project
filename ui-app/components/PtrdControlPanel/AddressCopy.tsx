import React from 'react';
import { CopyIcon } from '@chakra-ui/icons';
import { Code, HStack, Text } from '@chakra-ui/react';
import { formatAddress } from 'utils';

type AddressCopyProps = {
  label: string;
  onCopyClick: () => void;
  address: string;
};

export function AddressCopy({ label, onCopyClick, address }: AddressCopyProps) {
  return (
    <HStack>
      <Text w="205px">{label}:</Text>
      <Code cursor="pointer" onClick={onCopyClick}>
        {formatAddress(address, 8)}
      </Code>
      <CopyIcon
        color="white"
        cursor="pointer"
        onClick={onCopyClick}
        _hover={{ color: 'blue.200' }}
      />
    </HStack>
  );
}
