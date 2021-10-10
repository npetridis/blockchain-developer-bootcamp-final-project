import React from 'react';
import { Web3Context } from './Web3Context';
import type { Web3Provider as Web3ContextType } from './Web3Context';
import { ethers } from 'ethers';

export const Web3Provider: React.FC = ({ children }) => {
  const [provider, setProvider] = React.useState<Web3ContextType>(null);

  React.useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // gia metamask
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // gia allon client px locally h infura
    // const provider = new ethers.providers.JsonRpcProvider();

    setProvider(provider);
  }, []);

  return (
    <Web3Context.Provider value={provider}>{children}</Web3Context.Provider>
  );
};
