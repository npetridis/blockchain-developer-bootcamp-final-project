import React from 'react';

enum Networks {
  Mainnet = '1',
  Ropsten = '3',
  Rinkeby = '4',
  Goerli = '5',
  Kovan = '42',
  Ganache = '5777',
}

// A private key shouldn't get exposed
// Τhis is only for test reasons to demonstate the smart contract functionality

type EnvVars = {
  defiVaultContractAddress: string | undefined;
  petrideumErc20ContractAddress: string | undefined;
  petrideumOwnerPrivateKey: string | undefined;
}

export function useEnvVars(): EnvVars {
  const [activeNetwork, setActiveNetwork] = React.useState('N/A');
  React.useEffect(() => {
    const chainId = window.ethereum.networkVersion;
    setActiveNetwork(chainId);
    window.ethereum.on('chainChanged', (_chainId: string) => window.location.reload());
  }, []);

  switch (activeNetwork) {
    case Networks.Ganache:
      return {
        defiVaultContractAddress: process.env.NEXT_PUBLIC_DEFI_VAULT_CONTRACT_ADDRESS_GANACHE,
        petrideumErc20ContractAddress: process.env.NEXT_PUBLIC_PETRIDEUM_ERC20_CONTRACT_ADDRESS_GANACHE,
        petrideumOwnerPrivateKey: process.env.NEXT_PUBLIC_PETRIDEUM_OWNER_PRIVATE_KEY_GANACHE
      }
    case Networks.Mainnet:
    case Networks.Rinkeby:
    case Networks.Goerli:
    case Networks.Kovan:
    case 'N/A':
      return {} as EnvVars;
    case Networks.Ropsten:
    default:
      return {
        defiVaultContractAddress: process.env.NEXT_PUBLIC_DEFI_VAULT_CONTRACT_ADDRESS_ROPSTEN,
        petrideumErc20ContractAddress: process.env.NEXT_PUBLIC_PETRIDEUM_ERC20_CONTRACT_ADDRESS_ROPSTEN,
        petrideumOwnerPrivateKey: process.env.NEXT_PUBLIC_PETRIDEUM_OWNER_PRIVATE_KEY_ROPSTEN
      }
  }
}
