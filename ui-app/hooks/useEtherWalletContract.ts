import React from 'react';
import { BigNumber, ethers } from 'ethers';
import etherWalletAbiJson from '../../smart-contracts/build/contracts/EtherWallet.json';
import { useWeb3Provider } from 'contexts/web3';
import { useSigner } from './useSigner';

console.log('etherWalletAbiJson', etherWalletAbiJson);


type UseEtherWalletContract = {
  // contract: ethers.Contract | null;
  depositEther: (etherAmount: BigNumber) => Promise<BigNumber | null>;
  withdrawEther: (etherAmount: BigNumber) => Promise<BigNumber | null>;
  updateEtherBalance: () => Promise<BigNumber>;
  etherBalance: BigNumber;
};

export const useEtherWalletContract = (contractAddress: string): UseEtherWalletContract => {
  const provider = useWeb3Provider();
  const { getSigner } = useSigner();
  const [etherBalance, setEtherBalance] = React.useState(BigNumber.from(0));
  // const [contract, setContract] = React.useState<ethers.Contract | null>(null);

  const updateEtherBalance = React.useCallback(
    async () => {
      if (!provider) {
        return;
      }

      const contract = new ethers.Contract(
        contractAddress,
        etherWalletAbiJson.abi,
        provider
      );

      if (!contract) return null;
      const result = await contract.getEtherBalance();
      console.log('result', typeof result, result);

      setEtherBalance(result);
      return result;
    },
    [provider]
  );

  React.useEffect(() => {
    updateEtherBalance();
  }, [provider]);

  const withdrawEther = React.useCallback(
    async (etherAmount: BigNumber): Promise<BigNumber | null> => {
      if (!provider) {
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
      const result = await tx.wait();

      const withdrawEvent = result.events[0];
      const newBalance = withdrawEvent.args[2] as BigNumber;

      setEtherBalance(newBalance);
      return newBalance;
    },
    [provider]
  );

  const depositEther = React.useCallback(
    async (etherAmount: BigNumber): Promise<BigNumber | null> => {
      if (!provider) {
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
      const result = await tx.wait();

      const depositEvent = result.events[0];
      const newBalance = depositEvent.args[2] as BigNumber;
      // provider.once(tx.hash, (transaction) => {
      //   // Emitted when the transaction has been mined
      //   console.log('TRX', transaction)
      // })

      setEtherBalance(newBalance);
      return newBalance;
    },
    [provider]
  );

  return {
    depositEther,
    withdrawEther,
    updateEtherBalance,
    etherBalance
  };
};
