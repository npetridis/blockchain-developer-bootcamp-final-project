import React from 'react';
import { ethers } from 'ethers';
import { useWeb3Provider } from 'contexts/web3';
import erc20AbiJson from 'abi/ERC20.json';

type Erc20Info = {
  name: string;
  symbol: string;
}

const NOT_FOUND_INFO =  { name: 'N/A', symbol: 'N/A' };

type UseErc20Info = {
  getErc20Info: (contractAddress: string) => Promise<Erc20Info>
}

export function useErc20Info(): UseErc20Info {
  const provider = useWeb3Provider();
  
  const getErc20Info = React.useCallback(
    async (contractAddress: string): Promise<Erc20Info> => {
      if (!provider || !contractAddress) {
        return NOT_FOUND_INFO;
      }

      const contract = new ethers.Contract(
        contractAddress,
        erc20AbiJson.abi,
        provider
      );

      if (!contract) return NOT_FOUND_INFO;
      const name = await contract.name();
      const symbol = await contract.symbol();

      return { name, symbol };
    }, [provider]
  );
  
  return {
    getErc20Info
  };
}
