import React from 'react';
import { BigNumber, ethers, Signer } from 'ethers';
import erc20AbiJson from '../../smart-contracts/build/contracts/ERC20.json';
import { useWeb3Provider } from 'contexts/web3';
import { useSigner } from './useSigner';

type TokenData = {
  name: string;
  symbol: string;
  totalSupply: BigNumber;
};

const INITIAL_DATA: TokenData = {
  name: '',
  symbol: '',
  totalSupply: BigNumber.from('0'),
};

type UseErc20Token = TokenData & {
  contract: ethers.Contract | null;
  transfer: (recipient: string, amount: BigNumber) => Promise<any>;
  getTotalSupply: () => Promise<BigNumber | null>;
  getBalanceOf: (address: string) => Promise<BigNumber | null>;
  getAllowance: (spenderAddress: string, ownerAddress: string) => Promise<BigNumber | null>;
  approve: (spenderAddress: string, amount: BigNumber) => Promise<any>;
  transferFrom: (sender: string, recipient: string, amount: BigNumber) => Promise<any>;
};

export const useErc20Token = (
  contractAddress: string,
  signerPrivateKey?: string
): UseErc20Token => {
  const provider = useWeb3Provider();
  const { getSigner } = useSigner();
  const [contract, setContract] = React.useState<ethers.Contract | null>(null);
  const [tokenData, setTokenData] = React.useState<TokenData>(INITIAL_DATA);

  React.useEffect(() => {
    if (!provider) {
      return;
    }

    const erc20Contract = new ethers.Contract(
      contractAddress,
      erc20AbiJson.abi,
      provider
    );
    setContract(erc20Contract);

    const getTokenData = async () => {
      const name = await erc20Contract.name();
      const symbol = await erc20Contract.symbol();
      const totalSupply = await erc20Contract.totalSupply();

      setTokenData({ name, symbol, totalSupply: totalSupply });
    };
    getTokenData();
  }, [provider]
  );

  const getTotalSupply = React.useCallback(
    async (): Promise<BigNumber | null> => {
      if (!provider) {
        return null;
      }

      const contract = new ethers.Contract(
        contractAddress,
        erc20AbiJson.abi,
        provider
      );

      if (!contract) return null;
      const result = await contract.totalSupply();
      return result;
    }, [provider]
  );

  const getBalanceOf = React.useCallback(
    async (accountAddress: string): Promise<BigNumber | null> => {
      if (!provider) {
        return null;
      }

      const contract = new ethers.Contract(
        contractAddress,
        erc20AbiJson.abi,
        provider
      );

      if (!contract) return null;
      const result = await contract.balanceOf(accountAddress);

      console.log('result', typeof result, result);
      return result;
    }, [provider]);

  const getAllowance = React.useCallback(
    async (ownerAddress: string, spenderAddress: string): Promise<BigNumber | null> => {
      if (!provider) {
        return null;
      }

      const contract = new ethers.Contract(
        contractAddress,
        erc20AbiJson.abi,
        provider
      );

      if (!contract) return null;
      const result = await contract.allowance(ownerAddress, spenderAddress);

      console.log('result', typeof result, result);
      return result;
    }, [provider]
  );

  const transfer = React.useCallback(
    async (recipientAddress: string, amount: BigNumber) => {
      if (!provider) {
        return null;
      }

      let signer;
      if (signerPrivateKey) {
        signer = new ethers.Wallet(signerPrivateKey, provider);
      } else {
        signer = await getSigner();
      }

      if (!signer) {
        return null;
      }

      const contract = new ethers.Contract(
        contractAddress,
        erc20AbiJson.abi,
        signer
      );

      if (!contract) return null;
      const tx = await contract.transfer(recipientAddress, amount.toString());
      const result = await tx.wait();

      console.log('data', recipientAddress, amount.toString());
      console.log('result', typeof result, result);
      return result;
    }, [provider, signerPrivateKey]
  );

  const approve = React.useCallback(
    async (spenderAddress: string, amount: BigNumber) => {
      if (!provider) {
        return null;
      }

      let signer;
      if (signerPrivateKey) {
        signer = new ethers.Wallet(signerPrivateKey, provider);
      } else {
        signer = await getSigner();
      }

      if (!signer) {
        return null;
      }

      const contract = new ethers.Contract(
        contractAddress,
        erc20AbiJson.abi,
        signer
      );

      if (!contract) return null;
      const tx = await contract.approve(spenderAddress, amount.toString());
      const result = await tx.wait();

      console.log('result', typeof result, result);
      return result;
    }, [provider, signerPrivateKey]
  );

  const transferFrom = React.useCallback(
    async (senderAddress: string, recipientAddress: string, amount: BigNumber) => {
      if (!provider) {
        return null;
      }

      let signer;
      if (signerPrivateKey) {
        signer = new ethers.Wallet(signerPrivateKey, provider);
      } else {
        signer = await getSigner();
      }
      if (!signer) {
        return null;
      }

      const contract = new ethers.Contract(
        contractAddress,
        erc20AbiJson.abi,
        signer
      );

      if (!contract) return null;
      const tx = await contract.transferFrom(senderAddress, recipientAddress, amount.toString());
      const result = await tx.wait();

      console.log('result', typeof result, result);
      return result;
    }, [provider, signerPrivateKey]
  );

  return {
    ...tokenData,
    contract,
    transfer,
    getTotalSupply,
    getBalanceOf,
    getAllowance,
    approve,
    transferFrom
  };
};
