import React from 'react';
import { BigNumber, ethers } from 'ethers';
import erc20AbiJson from 'abi/erc20.abi.json';
import { useWeb3Provider } from 'contexts/web3';
import { noop } from 'utils';

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
  getAddressBalance: (address: string) => Promise<BigNumber | null>;
};

export const useErc20Token = (tokenAddress: string): UseErc20Token => {
  const provider = useWeb3Provider();
  const [contract, setContract] = React.useState<ethers.Contract | null>(null);
  const [tokenData, setTokenData] = React.useState<TokenData>(INITIAL_DATA);

  React.useEffect(() => {
    if (!provider) {
      return;
    }

    const erc20Contract = new ethers.Contract(
      tokenAddress,
      erc20AbiJson,
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
  }, [provider]);

  const getAddressBalance = React.useCallback(
    async (address: string) => {
      if (!contract) return null;
      const addressBalance = await contract.balanceOf(address);
      // return ethers.utils.formatUnits(addressBalance, 18);
      return addressBalance;
    },
    [contract]
  );

  return {
    ...tokenData,
    contract,
    getAddressBalance
  };
};
