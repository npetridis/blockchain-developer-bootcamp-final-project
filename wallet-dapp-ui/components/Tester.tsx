import React from 'react';
import { ethers } from 'ethers';

export const Tester = async () => {
  const [provider, setProvider] =
    React.useState<ethers.providers.Web3Provider>();
  React.useEffect(() => {
    setProvider(new ethers.providers.Web3Provider(window.ethereum));
  }, []);

  // gia metamask
  // const provider = new ethers.providers.Web3Provider(window.ethereum);
  // gia gia allon client px locally h infura
  // const provider = new ethers.providers.JsonRpcProvider();

  const getBlockNumber = async () => {
    const blockNumber = await provider?.getBlockNumber();
    return blockNumber;
  };

  const blockNumber = await provider?.getBlockNumber();

  const signer = provider?.getSigner();

  console.log({ blockNumber });

  return <p style={{ color: 'white' }}>Hello, world!</p>;
};

export default Tester;
