import React from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { Layout } from 'components/Layout';
import Head from 'next/head';
import { Web3Provider } from 'contexts/web3';

function MyApp({ Component, pageProps }: AppProps): React.ReactNode {
  let test = 'sd';
  let te = 'fdsa';
  return (
    <>
      <Head>
        <title>Petra Wallet</title>
      </Head>
      <ChakraProvider resetCSS>
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
