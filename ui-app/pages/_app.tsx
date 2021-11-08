import React from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { Layout } from 'components/Layout';
import Head from 'next/head';
import { Web3Provider } from 'contexts/web3';

import { theme } from '../theme';

console.log('theme', theme);

function MyApp({ Component, pageProps }: AppProps): React.ReactNode {
  return (
    <>
      <Head>
        <title>DefiVault</title>
      </Head>
      <ChakraProvider resetCSS theme={theme}>
        <Web3Provider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Web3Provider>
      </ChakraProvider>
    </>
  );
}
export default MyApp;
