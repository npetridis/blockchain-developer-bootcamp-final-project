import React from 'react';
import { useWeb3Provider } from 'contexts/web3';

export const useSigner = () => {
  const provider = useWeb3Provider();

  const getSigner = React.useCallback(() => {
    if (!provider) {
      return undefined;
    }

    return provider.getSigner();
  }, [provider]);

  const connectSigner = React.useCallback(async () => {
    if (!provider) {
      return false;
    }
    const signer = provider.getSigner();
    if (!signer) {
      return;
    }

    signer.getAddress();

    await signer.getAddress();

    return signer;
  }, [provider]);

  return {
    connectSigner,
    getSigner
  }
}
