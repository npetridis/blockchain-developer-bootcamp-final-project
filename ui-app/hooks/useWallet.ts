import React from 'react';
import { useWeb3Provider } from 'contexts/web3';
import { BigNumber, ethers } from 'ethers';

// TODO: na ginei me context to state gia na einai to idio pantou

export const useWallet = () => {
  const provider = useWeb3Provider();
  const [isConnecting, setIsConnecting] = React.useState<boolean>();
  const [accounts, setAccounts] = React.useState<Array<string>>([]);
  const [signerAddress, setSignerAddress] = React.useState<string>();
  const [ethBalance, setEthBalance] = React.useState(BigNumber.from(0));

  React.useEffect(() => {
    updateAccounts();

    // const listener = (newAccounts: Array<string>) => {
    //   console.log('NEW ACCOUNTS', newAccounts);
    //   setAccounts(newAccounts);
    // };

    // provider.on('accountsChanged', (newAccounts: Array<string>) => {
    //   console.log('NEW ACCOUNTS', newAccounts);
    //   setAccounts(newAccounts);
    // });

    // return () => {
    //   provider.removeListener('accountsChanged', listener);
    // }

    // console.log('isMetamask', window.ethereum.isMetaMask);

    window.ethereum.on('accountsChanged', async function (newAccounts: Array<string>) {
      setAccounts(newAccounts);
      updateSigner();
    });

    // TODO: switch with provider.on and add cleanup
  }, [provider]);

  const updateSigner = async () => {
    if (!provider) {
      return;
    }
    try {
      const signer = provider.getSigner();
      setSignerAddress(await signer.getAddress());
      setEthBalance(await signer.getBalance());
    } catch (error) {
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
    setIsConnecting(true);
    await window.ethereum.enable(); // TODO replace, it is deprecated
    // ethers.Wallet.co
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
