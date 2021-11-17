import React from 'react';
import { Flex, Button, Box, HStack, Tag, Grid, Icon } from '@chakra-ui/react';
import { useWallet } from 'hooks';
import { Menu } from './Menu';
import { WalletInfo } from './WalletInfo';
import DefiVault from '../../public/defivault.svg';

type Props = {
  children?: React.ReactNode;
};

export function Layout({ children }: Props) {
  const { isConnected, signerAddress, ethBalance, connectWallet } = useWallet();
  return (
    <Box h="100vh" w="100vw" bg="background.light">
      <Flex
        flexDirection="column"
        h="100vh"
        w="100vw"
        bg="#212429"
        align="center"
        zIndex="2"
      >
        <Grid
          flexDirection="row"
          gridTemplateColumns="120px 1fr 120px"
          as="header"
          alignItems="center"
          justifyContent="space-between"
          w="100%"
          p="4"
          mb="8"
          // zIndex="2"
        >
          <Icon w='141px' h='40px' as={DefiVault} />
          <Menu />
          {isConnected ? (
            <WalletInfo balance={ethBalance} address={signerAddress} />
          ) : (
            <Button justifySelf="end" onClick={connectWallet}>
              Connect to wallet
            </Button>
          )}
        </Grid>
        <Flex
          justify="center"
          align="start"
          flex="1"
          w="100%"
          p="2"
          zIndex="inherit"
        >
          {children}
        </Flex>
      </Flex>
      <Box
        position="fixed"
        top="0"
        right="0"
        bottom="0"
        left="0"
        width="200vw"
        height="200vw"
        bg="radial-gradient(50% 50% at 50% 50%,#ffa50c2b 0,rgb(255 255 255 / 0%) 100%)"
        transform="translate(-50vw, -100vh)"
        pointerEvents="none"
      />
    </Box>
  );
}
