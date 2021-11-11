import React from 'react';
import { BigNumber, ethers } from 'ethers';
import defiVaultAbiJson from '../../smart-contracts/build/contracts/DefiVault.json';
import { useWeb3Provider } from 'contexts/web3';
import { useSigner } from './useSigner';
import { useErc20Info } from './useErc20Info';

enum Events {
  DepositErc20 = 'DepositERC20',
  WithdrawErc20 = 'WithdrawERC20',
};

type TokenBalance = {
  address: string;
  balance: BigNumber;
  name: string;
  symbol: string;
};

type GetTokensResponse = {
  tokens: string[];
  balances: BigNumber[];
  length: number;
} | null;

type UseDefiVaultContract = {
  depositToken: (tokenAddress: string, etherAmount: BigNumber) => Promise<any>;
  withdrawToken: (tokenAddress: string, etherAmount: BigNumber) => Promise<any>;
  getTokens: () => Promise<GetTokensResponse>;
  tokenBalances: TokenBalance[] | undefined;
};

export const useDefiVaultContract = (contractAddress: string): UseDefiVaultContract => {
  const provider = useWeb3Provider();
  const { getSigner } = useSigner();
  const [tokenBalances, setTokenBalances] = React.useState<TokenBalance[]>();
  const { getErc20Info } = useErc20Info();

  const updateAllTokensBalance = React.useCallback(
    async () => {
      const result = await getTokens();
      if (!result) return;
      const mergedResult: TokenBalance[] = await Promise.all(result.tokens.map(async (address, index) => ({
        address,
        balance: result.balances[index],
        ...(await getErc20Info(address) || {})
      })));

      setTokenBalances(mergedResult);
    },
    [provider]
  );

  React.useEffect(() => {
    updateAllTokensBalance();
  }, [provider]);

  const updateTokenBalance = React.useCallback(async (addressToUpdate: string, newBalance: BigNumber) => {
    if (!tokenBalances) {
      const newTokenBalances = await Promise.resolve([{
        address: addressToUpdate,
        balance: newBalance,
        ...(await getErc20Info(addressToUpdate))
      }]);
      setTokenBalances(newTokenBalances);
      return;
    }

    const tokenIndex = tokenBalances.findIndex(({ address }) => address === addressToUpdate);

    const newTokenBalances = [...tokenBalances];
    newTokenBalances[tokenIndex] = {
      ...newTokenBalances[tokenIndex],
      balance: newBalance
    };

    setTokenBalances(newTokenBalances);
  }, [tokenBalances, setTokenBalances])

  const withdrawToken = React.useCallback(
    async (tokenAddress: string, amount: BigNumber): Promise<any> => {
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
      const txData = await tx.wait();

      const withdrawErc20event = txData.events.find(e => e?.event === Events.WithdrawErc20);
      const newBalance = withdrawErc20event.args[3] as BigNumber;

      updateTokenBalance(tokenAddress, newBalance);
      return txData;
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
      const txData = await tx.wait();

      const depositErc20event = txData.events.find(e => e?.event === Events.DepositErc20);
      const newBalance = depositErc20event.args[3] as BigNumber;

      updateTokenBalance(tokenAddress, newBalance);

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
