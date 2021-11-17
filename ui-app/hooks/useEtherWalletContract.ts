import React from 'react';
import { BigNumber, ethers } from 'ethers';
import etherWalletAbiJson from 'abi/EtherWallet.json';
import { useWeb3Provider } from 'contexts/web3';
import { useSigner } from './useSigner';

console.log('etherWalletAbiJson', etherWalletAbiJson);


type UseEtherWalletContract = {
  // contract: ethers.Contract | null;
  depositEther: (etherAmount: BigNumber) => Promise<any>;
  withdrawEther: (etherAmount: BigNumber) => Promise<any>;
  updateEtherBalance: () => Promise<BigNumber>;
  etherBalance: BigNumber;
};

export const useEtherWalletContract = (contractAddress: string | undefined): UseEtherWalletContract => {
  const provider = useWeb3Provider();
  const { getSigner } = useSigner();
  const [etherBalance, setEtherBalance] = React.useState(BigNumber.from(0));

  const updateEtherBalance = React.useCallback(
    async () => {
      if (!provider || !contractAddress) {
        return;
      }

      const signer = await getSigner()
      if (!signer) {
        console.log('No signer');
        return null;
      }

      const contract = new ethers.Contract(
        contractAddress,
        etherWalletAbiJson.abi,
        signer
      );


      if (!contract) return null;
      const result = await contract.getEtherBalance();
      console.log('result', typeof result, result);

      setEtherBalance(result);
      return result;
    },
    [provider, setEtherBalance, contractAddress]
  );

  React.useEffect(() => {
    updateEtherBalance();
  }, [provider, contractAddress, updateEtherBalance]);

  const withdrawEther = React.useCallback(
    async (etherAmount: BigNumber): Promise<any> => {
      if (!provider || !contractAddress) {
        return null;
      }

      const signer = await getSigner()
      if (!signer) {
        console.log('No signer');
        return null;
      }

      const contract = new ethers.Contract(
        contractAddress,
        etherWalletAbiJson.abi,
        signer
      );

      if (!contract) return null;
      const tx = await contract.withdrawEther(etherAmount.toString());
      const txData = await tx.wait();

      const withdrawEvent = txData.events[0];
      const newBalance = withdrawEvent.args[2] as BigNumber;

      setEtherBalance(newBalance);
      return txData;
    },
    [provider, contractAddress]
  );

  const depositEther = React.useCallback(
    async (etherAmount: BigNumber): Promise<any> => {
      if (!provider || !contractAddress) {
        return null;
      }

      const signer = await getSigner();
      if (!signer) {
        console.log('No signer');
        return null;
      }

      const contract = new ethers.Contract(
        contractAddress,
        etherWalletAbiJson.abi,
        signer
      );

      if (!contract) return null;
      const tx = await contract.depositEther({ value: etherAmount });
      const txData = await tx.wait();

      const depositEvent = txData.events[0];
      const newBalance = depositEvent.args[2] as BigNumber;
      // provider.once(tx.hash, (transaction) => {
      //   // Emitted when the transaction has been mined
      //   console.log('TRX', transaction)
      // })

      setEtherBalance(newBalance);
      return txData;
    },
    [provider, contractAddress]
  );

  return {
    depositEther,
    withdrawEther,
    updateEtherBalance,
    etherBalance
  };
};
