import React from 'react';
import { BigNumber, ethers } from 'ethers';
import defiVaultAbiJson from '../../smart-contracts/build/contracts/DefiVault.json';
import { useWeb3Provider } from 'contexts/web3';
import { useSigner } from './useSigner';

console.log('defiVaultAbiJson', defiVaultAbiJson);


type UseDefiVaultContract = {
  // contract: ethers.Contract | null;
  depositToken: (tokenAddress: string, etherAmount: BigNumber) => Promise<BigNumber | null>;
  withdrawToken: (tokenAddress: string, etherAmount: BigNumber) => Promise<BigNumber | null>;
  updateTokensBalance: () => Promise<BigNumber>;
  tokenBalances: any;
};

export const useDefiVaultContract = (contractAddress: string): UseDefiVaultContract => {
  const provider = useWeb3Provider();
  const { getSigner } = useSigner();
  const [tokenBalances, setTokenBalances] = React.useState();
  // const [contract, setContract] = React.useState<ethers.Contract | null>(null);

  const updateTokensBalance = React.useCallback(
    async () => {
      if (!provider) {
        return;
      }

      const contract = new ethers.Contract(
        contractAddress,
        defiVaultAbiJson.abi,
        provider
      );

      if (!contract) return null;
      const result = await contract.getTokens();
      console.log('result', typeof result, result);

      setTokenBalances(result);
      return result;
    },
    [provider]
  );

  React.useEffect(() => {
    updateTokensBalance();
  }, [provider]);

  const withdrawToken = React.useCallback(
    async (tokenAddress: string, amount: BigNumber): Promise<BigNumber | null> => {
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
        defiVaultAbiJson.abi,
        signer
      );

      if (!contract) return null;
      const tx = await contract.withdrawToken(tokenAddress, amount.toString());
      const result = await tx.wait();

      const withdrawErc20Event = result.events[0];
      const newBalance = withdrawErc20Event.args[3] as BigNumber;

      // setTokenBalances(newBalance);
      return newBalance;
    },
    [provider]
  );

  const depositToken = React.useCallback(
    async (tokenAddress: string, amount: BigNumber): Promise<BigNumber | null> => {
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
        defiVaultAbiJson.abi,
        signer
      );

      if (!contract) return null;
      const tx = await contract.depositToken(tokenAddress, amount.toString());
      const result = await tx.wait();

      const depositErc20Event = result.events[0];
      const newBalance = depositErc20Event.args[3] as BigNumber;

      // update the current token address balance
      // setTokenBalances(newBalance);
      return newBalance;
    },
    [provider]
  );

  return {
    depositToken,
    withdrawToken,
    updateTokensBalance,
    tokenBalances
  };
};
