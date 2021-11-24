import React from 'react';
import {
  Center,
  Heading,
  Select,
  Stack,
  Spinner
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import { Card, AddressCopy } from 'components/common';
import { useEnvVars, useSigner } from 'hooks';
import { useWeb3Provider } from 'contexts/web3';
import { formatAddress } from 'utils';

type SignerSelectorProps = {
  onSignerChange: (pk: string | undefined) => void;
};

export function SignerSelector({
  onSignerChange,
}: SignerSelectorProps): JSX.Element {
  const provider = useWeb3Provider();
  const { petrideumOwnerPrivateKey, defiVaultContractAddress } = useEnvVars();
  const { getSigner } = useSigner();
  const [ptrdDeployerAddress, setPtrdDeployerAddress] = React.useState('');
  const [metamaskAddress, setMetamaskAddress] = React.useState('');

  const updateMetamaskAddress = async function () {
    const metamaskSigner = await getSigner();
    if (!metamaskSigner) {
      return;
    }
    try {
      const signerAddress = await metamaskSigner.getAddress();
      setMetamaskAddress(signerAddress);
    } catch (error) {
      
    }
  };

  React.useEffect(() => {
    if (petrideumOwnerPrivateKey) {
      onSignerChange(petrideumOwnerPrivateKey);
    }
  }, [petrideumOwnerPrivateKey]);

  React.useEffect(() => {
    if (!provider || !petrideumOwnerPrivateKey) {
      return;
    }
    const ptrdSigner = new ethers.Wallet(petrideumOwnerPrivateKey, provider);
    if (!ptrdSigner) return;

    const updatePtrdAddress = async function () {
      try {
        const signerAddress = await ptrdSigner.getAddress();
        setPtrdDeployerAddress(signerAddress);
      } catch (error) {

      }
    };

    updatePtrdAddress();
    updateMetamaskAddress();

    window.ethereum.on('accountsChanged', updateMetamaskAddress);

    return () => {
      window.ethereum.removeListener('accountsChanged', updateMetamaskAddress);
    };
  }, [provider, petrideumOwnerPrivateKey]);

  const handleSelectChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('BBBBB', value);
    onSignerChange(value === 'metamaskProvider' ? undefined : value);
  };

  if (!petrideumOwnerPrivateKey || !defiVaultContractAddress) {
    return (
      <Center h='237px'>
        <Spinner color='white'/>
      </Center>
    )
  }

  return (
    <Card light>
      <Heading mb="4" fontSize="1em" color="background.white">
        Select Signer to perform the operations
      </Heading>
      <Stack spacing="1em">
        <Select
          defaultValue="owner"
          size="md"
          color="text.regular"
          onChange={handleSelectChange}
        >
          <option value={petrideumOwnerPrivateKey}>
            {formatAddress(ptrdDeployerAddress, 12)} (PTRD contract deployer)
          </option>
          <option value="metamaskProvider">
            {formatAddress(metamaskAddress, 14)} (Metamask account)
          </option>
        </Select>
        <Stack spacing="0.25em">
          <AddressCopy
            label="PTRD contract deployer:"
            address={ptrdDeployerAddress}
          />
          <AddressCopy
            label="Metamask account address:"
            address={metamaskAddress}
          />
          <AddressCopy
            label="DefiVault contract address:"
            address={defiVaultContractAddress}
          />
        </Stack>
      </Stack>
    </Card>
  );
}
