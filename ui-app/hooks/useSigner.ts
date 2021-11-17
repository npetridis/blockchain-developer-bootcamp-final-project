import React from 'react';
import { useWeb3Provider } from 'contexts/web3';

export const useSigner = () => {
  const provider = useWeb3Provider();
  // const [isConnecting, setIsConnecting] = React.useState<boolean>();

  // React.useEffect(() => {
  //   if (!provider) {
  //     return;
  //   }
  //   const signer = provider.getSigner()

  //   setSigner(signer);
  // }, [provider]);

  // const updateAccounts = React.useCallback(async () => {
  //   if (!provider) {
  //     return;
  //   }

  //   const newAccounts = await provider.listAccounts();
  //   setAccounts(newAccounts);
  // }, [provider]);

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
    console.log('SIGNER', signer);

    signer.getAddress();
    // signer.connect(window.ethereum); // TODO FIXX

    const addr = await signer.getAddress();

    console.log('signer', signer, addr);

    return signer;
  }, [provider]);

  return {
    connectSigner,
    getSigner
  }
}
