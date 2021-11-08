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

    const blockListener = (blockNumber: number) => {
      // Emitted on every block change
      setBlockNumber(blockNumber)
    }

    provider.on("block", blockListener);

    return () => void provider.removeListener('block', blockListener);

  }, [provider]);

  return {
    blockNumber,
  };
};
