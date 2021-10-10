import React from 'react';
import { Flex } from '@chakra-ui/react';

type Props = {
  children?: React.ReactNode;
};

export function Layout({ children }: Props) {
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      h="100vh"
      bg="gray.800"
    >
      {children}
    </Flex>
  );
}
