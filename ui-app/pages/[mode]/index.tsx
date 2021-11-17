import React from 'react';
import type { NextPage } from 'next';
import { useAppMode } from 'hooks';
import { EtherWallet, Erc20Wallet, PtrdControlPanel } from 'components';
import { AppModes } from 'components/Layout';
import { Center, Spinner } from '@chakra-ui/react';

const Home: NextPage = () => {
  const mode = useAppMode();

  if (mode === AppModes.Loading) {
    return (
      <Center h="30vh">
        <Spinner color="white" />
      </Center>
    );
  } else if (mode === AppModes.Ether) {
    return <EtherWallet />;
  } else if (mode === AppModes.ERC20) {
    return <Erc20Wallet />;
  } else if (mode === AppModes.PTRD) {
    return <PtrdControlPanel />;
  }
  return <div>Not found page</div>;
};

export default Home;
