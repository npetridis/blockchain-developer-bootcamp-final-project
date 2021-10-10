import React from 'react';
import { useWeb3Provider } from 'contexts/web3';

export const useBlockNumber = () => {
  const provider = useWeb3Provider();
  const [blockNumber, setBlockNumber] = React.useState<number>();

  React.useEffect(() => {
    if (!provider) {
      return;
    }

    const getBlockNumber = async () => {
      const data = await provider.getBlockNumber();
      setBlockNumber(data);
    };

    getBlockNumber();
  }, [provider]);

  return {
    blockNumber,
  };
};
