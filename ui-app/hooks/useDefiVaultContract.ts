import React from 'react';
import { BigNumber, ethers } from 'ethers';
import defiVaultAbiJson from 'abi/DefiVault.json';
import { useWeb3Provider } from 'contexts/web3';
import { useSigner } from './useSigner';
import { useErc20Info } from './useErc20Info';
import { useToast } from './useToast';

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
  depositToken: (tokenAddress: string, tokenAmount: BigNumber) => Promise<any>;
  withdrawToken: (tokenAddress: string, tokenAmount: BigNumber) => Promise<any>;
  getTokens: () => Promise<GetTokensResponse>;
  supplyTokenToCompound: (tokenAddress: string, cTokenAddress: string, tokenAmount: BigNumber) => Promise<any>;
  redeemTokenFromCompound: (cTokenAmount: BigNumber, cTokenAddress: string) => Promise<any>;
  tokenBalances: TokenBalance[] | undefined;
};

export const useDefiVaultContract = (contractAddress: string | undefined): UseDefiVaultContract => {
  const provider = useWeb3Provider();
  const { getSigner } = useSigner();
  const [tokenBalances, setTokenBalances] = React.useState<TokenBalance[]>();
  const { getErc20Info } = useErc20Info();
  const { successTransactionToast } = useToast();

  const getTokens = React.useCallback(
    async (): Promise<GetTokensResponse> => {
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
        defiVaultAbiJson.abi,
        signer
      );
      if (!contract) return null;

      const result = await contract.getTokens();
      return result;
    },
    [provider, contractAddress]
  );

  const updateAllTokensBalance = React.useCallback(
    async () => {
      try {
        const result = await getTokens();
        if (!result) return;
        const mergedResult: TokenBalance[] = await Promise.all(result.tokens.map(async (address, index) => ({
          address,
          balance: result.balances[index],
          ...(await getErc20Info(address) || {})
        })));

        setTokenBalances(mergedResult);
      } catch (error) {

      }
    },
    [provider, contractAddress, getTokens]
  );

  React.useEffect(() => {
    updateAllTokensBalance();
  }, [provider, contractAddress, updateAllTokensBalance]);

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
  }, [tokenBalances, contractAddress, setTokenBalances]);

  const withdrawToken = React.useCallback(
    async (tokenAddress: string, amount: BigNumber): Promise<any> => {
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
        defiVaultAbiJson.abi,
        signer
      );

      if (!contract) return null;
      const tx = await contract.withdrawToken(tokenAddress, amount.toString());
      successTransactionToast({ txHash: tx.hash });
      const txData = await tx.wait();

      const withdrawErc20event = txData.events.find((e: any) => e?.event === Events.WithdrawErc20);
      const newBalance = withdrawErc20event.args[3] as BigNumber;

      updateAllTokensBalance()
      return txData;
    },
    [provider, contractAddress, updateAllTokensBalance]
  );

  const depositToken = React.useCallback(
    async (tokenAddress: string, amount: BigNumber): Promise<any> => {
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
        defiVaultAbiJson.abi,
        signer
      );

      if (!contract) return null;

      console.log('BBB', tokenAddress, amount.toString())

      try {
        const tx = await contract.depositToken(tokenAddress, amount.toString());
        successTransactionToast({ txHash: tx.hash });
        const txData = await tx.wait();

        updateAllTokensBalance();
        return txData;
      } catch (error) {
        console.log('pame re paidiaa!', error);

      }
    },
    [provider, contractAddress, updateAllTokensBalance]
  );

  const supplyTokenToCompound = React.useCallback(
    async (erc20ContractAddress: string, cErc20ContractAddress: string, amount: BigNumber): Promise<any> => {
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
        defiVaultAbiJson.abi,
        signer
      );

      if (!contract) return null;
      try {
        const tx = await contract.supplyErc20ToCompound(erc20ContractAddress, cErc20ContractAddress, amount.toString());
        successTransactionToast({ txHash: tx.hash });
        const txData = await tx.wait();
        updateAllTokensBalance();
        return txData;
      } catch (error) {
        console.log('pame re paidiaa', error);
      }

    },
    [provider, contractAddress, updateAllTokensBalance]
  );

  const redeemTokenFromCompound = React.useCallback(
    async (cTokenAmount: BigNumber, cErc20ContractAddress: string): Promise<any> => {
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
        defiVaultAbiJson.abi,
        signer
      );

      if (!contract) return null;
      const tx = await contract.redeemCErc20Tokens(cTokenAmount.toString(), cErc20ContractAddress);
      successTransactionToast({ txHash: tx.hash });
      const txData = await tx.wait();

      updateAllTokensBalance();
      return txData;
    },
    [provider, contractAddress, updateAllTokensBalance]
  );

  return {
    depositToken,
    withdrawToken,
    getTokens,
    supplyTokenToCompound,
    redeemTokenFromCompound,
    tokenBalances
  };
};
