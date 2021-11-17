import React from 'react';
import { CopyIcon } from '@chakra-ui/icons';
import { Code, HStack, Text, useClipboard } from '@chakra-ui/react';
import { formatAddress } from 'utils';

type AddressCopyProps = {
  label: string;
  address: string | undefined;
  addressDigits?: number;
  fullWidth?: boolean;
};

export function AddressCopy({ label, address, fullWidth, addressDigits = 8 }: AddressCopyProps) {
  const { onCopy } = useClipboard(address || '');

  if (!address) {
    return null;
  }

  return (
    <HStack>
      <Text w={fullWidth ? '100%' : '205px'}>{label}</Text>
      <Code cursor="pointer" onClick={onCopy}>
        {formatAddress(address, addressDigits)}
      </Code>
      <CopyIcon
        color="white"
        cursor="pointer"
        onClick={onCopy}
        _hover={{ color: 'blue.200' }}
      />
    </HStack>
  );
}
