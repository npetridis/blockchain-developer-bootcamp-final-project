import React from 'react';
import type { NextPage } from 'next';
import { useConnectAccount, useBlockNumber, useErc20Token } from 'hooks';
import { useWeb3Provider } from 'contexts/web3';
// import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const { isConnected, connectAccount } = useConnectAccount();
  const provider = useWeb3Provider();
  const signer = provider?.getSigner();
  const { blockNumber } = useBlockNumber();
  const { name, symbol, totalSupply, getAddressBalance } = useErc20Token(
    process.env.NEXT_PUBLIC_PETRIDEREUM_ERC20_ADDRESS as string
  );

  React.useEffect(() => {
    const enableEth = async () => await window.ethereum.enable();
    enableEth();
  }, []);

  getAddressBalance('0x01758d6FB2B77D4D7206b0D080FF63e8BE1D156B').then(
    (balance) => console.log('PTRD balance', balance?.toString())
  );

  // signer?.getAddress().then((data) => console.log('data', data));

  const handleConnect = () => connectAccount();

  // me to metamask API na vrw pote einai connected, unlocked/authenticated gia na mporesw na parw to account address
  // kai na kanw sign transactions

  return (
    <div>
      <p style={{ color: 'white' }}>Block number {blockNumber}</p>
      <p style={{ color: 'white' }}>Name {name}</p>
      <p style={{ color: 'white' }}>Symbol {symbol}</p>
      <p style={{ color: 'white' }}>Total supply {totalSupply.toString()}</p>
      <p
        style={{
          color: 'white',
          background: isConnected() ? 'darkgreen' : 'darkred',
        }}
      >
        Is connected {isConnected}
      </p>
      <button style={{ background: 'white' }} onClick={handleConnect}>
        Connect
      </button>
    </div>
  );
};

export default Home;
