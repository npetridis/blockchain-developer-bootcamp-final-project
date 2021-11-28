import React from 'react';
import { useWeb3Provider } from 'contexts/web3';
import { BigNumber } from 'ethers';
import { useToast } from './useToast';

export const useWallet = () => {
  const provider = useWeb3Provider();
  const [isConnecting, setIsConnecting] = React.useState<boolean>();
  const [accounts, setAccounts] = React.useState<Array<string>>([]);
  const [signerAddress, setSignerAddress] = React.useState<string>();
  const [ethBalance, setEthBalance] = React.useState(BigNumber.from(0));
  const { errorToast } = useToast();

  React.useEffect(() => {
    updateAccounts();

    if (!window.ethereum) {
      return;
    }

    const accountsChangeListener = function (newAccounts: Array<string>) {
      setAccounts(newAccounts);
      updateSigner();
    }

    window.ethereum.on('accountsChanged', accountsChangeListener);
    return () => window.ethereum.removeListener('accountsChanged', accountsChangeListener);
  }, [provider]);

  React.useEffect(() => {
    if (!provider) {
      return;
    }

    const blockListener = (blockNumber: number) => {
      // Emitted on every block change
      updateSigner();
    }

    provider.on("block", blockListener);

    return () => void provider.removeListener('block', blockListener);

  }, []);

  const updateSigner = async () => {
    if (!provider) {
      return;
    }
    try {
      const signer = provider.getSigner();
      if (!signer) {
        return;
      }

      setSignerAddress(await signer.getAddress());
      setEthBalance(await signer.getBalance());
    } catch (error: any) {
      setSignerAddress(undefined);
      setEthBalance(BigNumber.from(0));
    }
  }

  const updateAccounts = React.useCallback(async () => {
    if (!provider) {
      return;
    }

    const newAccounts = await provider.listAccounts();
    setAccounts(newAccounts);
    updateSigner();
  }, [provider]);

  const connectWallet = React.useCallback(async () => {
    if (!window.ethereum) {
      errorToast({ title: 'Please install Metamask and try again', description: ' ' })
      return;
    }
    setIsConnecting(true);
    await window.ethereum.enable();
    setIsConnecting(false);
  }, [setIsConnecting]);

  return {
    isConnecting,
    isConnected: !!accounts.length,
    connectWallet,
    accounts,
    signerAddress,
    ethBalance
  }
}
