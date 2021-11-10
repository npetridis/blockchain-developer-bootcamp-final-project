import React from 'react';
import { BigNumber, ethers } from 'ethers';
import defiVaultAbiJson from '../../smart-contracts/build/contracts/DefiVault.json';
import { useWeb3Provider } from 'contexts/web3';
import { useSigner } from './useSigner';

console.log('defiVaultAbiJson', defiVaultAbiJson);

enum Events {
  DepositErc20 = 'DepositERC20',
  WithdrawErc20 = 'WithdrawErc20',
};

type TokenBalance = {
  address: string;
  balance: BigNumber;
};

type GetTokensResponse = {
  tokens: string[];
  balances: BigNumber[];
  length: number;
} | null;

type UseDefiVaultContract = {
  depositToken: (tokenAddress: string, etherAmount: BigNumber) => Promise<any>;
  withdrawToken: (tokenAddress: string, etherAmount: BigNumber) => Promise<BigNumber | null>;
  getTokens: () => Promise<GetTokensResponse>;
  tokenBalances: TokenBalance[] | undefined;
};

export const useDefiVaultContract = (contractAddress: string): UseDefiVaultContract => {
  const provider = useWeb3Provider();
  const { getSigner } = useSigner();
  const [tokenBalances, setTokenBalances] = React.useState<TokenBalance[]>();
  // const [contract, setContract] = React.useState<ethers.Contract | null>(null);

  const updateAllTokensBalance = React.useCallback(
    async () => {
      const result = await getTokens();
      if (!result) return;
      const mergedResult: TokenBalance[] = result.tokens.map((address, index) => ({
        address,
        balance: result.balances[index]
      }));
      setTokenBalances(mergedResult);
    },
    [provider]
  );

  React.useEffect(() => {
    updateAllTokensBalance();
  }, [provider]);

  const updateTokenBalance = React.useCallback((addressToUpdate: string, newBalance: BigNumber) => {
    if (!tokenBalances) {
      setTokenBalances([{ address: addressToUpdate, balance: newBalance }]);
      return;
    }

    console.log('CCCC', addressToUpdate, newBalance.toString(), tokenBalances)
    const tokenIndex = tokenBalances.findIndex(({ address }) => address === addressToUpdate);
    // if (tokenIndex === -1) return;
    const newTokenBalances = [...tokenBalances];
    newTokenBalances[tokenIndex] = { address: addressToUpdate, balance: newBalance };
    setTokenBalances(newTokenBalances);
  }, [tokenBalances, setTokenBalances])

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
    async (tokenAddress: string, amount: BigNumber): Promise<any> => {
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
      console.log('AAAA tx', tx)
      const txData = await tx.wait();

      const depositErc20event = txData.events.find(e => e?.event === Events.DepositErc20);
      const newBalance = depositErc20event.args[3] as BigNumber;
      // use tokenAddress and newBalance to update local state
      console.log('BBBB tx', txData)
      updateTokenBalance(tokenAddress, newBalance);
      // the update will happen with an event listener
      // return tx success data and update with the new balance the local state

      // update the current token address balance
      // setTokenBalances(newBalance);
      // return newBalance;
      return txData;
    },
    [provider, updateTokenBalance]
  );

  const getTokens = React.useCallback(
    async (): Promise<GetTokensResponse> => {
      if (!provider) {
        return null;
      }

      const contract = new ethers.Contract(
        contractAddress,
        defiVaultAbiJson.abi,
        provider
      );
      if (!contract) return null;

      const result = await contract.getTokens();
      console.log('AAAA', result);
      return result;
    },
    [provider]
  );

  return {
    depositToken,
    withdrawToken,
    getTokens,
    tokenBalances
  };
};
