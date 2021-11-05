import React from 'react';
import { Flex, Button, Box, HStack, Tag } from '@chakra-ui/react';
import { useWallet } from 'hooks';

type Props = {
  children?: React.ReactNode;
};

export function Layout({ children }: Props) {
  const { isConnected, signerAddress, ethBalance, connectWallet } = useWallet();
  return (
    <Flex
      flexDirection="column"
      // alignItems="center"
      // justifyContent="center"
      h="100vh"
      w="100vw"
      bg="gray.800"
      align="center"
    >
      <Flex
        as="header"
        align="center"
        justify="space-between"
        w="100%"
        p="4"
        mb="8"
      >
        <Box h="2em" w="2em" borderRadius="full" bg="gray.50" />
        {isConnected ? (
          <HStack spacing="4">
            <Tag>{ethBalance.toString()} ETH</Tag>
            <Tag>{signerAddress}</Tag>
          </HStack>
        ) : (
          <Button onClick={connectWallet}>Connect to wallet</Button>
        )}
      </Flex>
      <Box maxW="900" flex="1" w="100%" p="2">
        {children}
      </Box>
    </Flex>
  );
}
