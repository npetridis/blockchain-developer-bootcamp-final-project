import React from 'react';
import {
  Heading,
  Select,
  Stack,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import { Card, AddressCopy } from 'components/common';
import { useSigner } from 'hooks';
import { useWeb3Provider } from 'contexts/web3';
import { formatAddress } from 'utils';

// A private key shouldn't get exposed
// Τhis is only for test reasons to demonstate the smart contract functionality
const ptrdOwnerPrivateKey = process.env
  .NEXT_PUBLIC_PETRIDEUM_OWNER_PRIVATE_KEY as string;

const defiVaultContractAddress = process.env
  .NEXT_PUBLIC_DEFI_VAULT_CONTRACT_ADDRESS as string;

type SignerSelectorProps = {
  onSignerChange: (pk: string | undefined) => void;
};

export function SignerSelector({
  onSignerChange,
}: SignerSelectorProps): JSX.Element {
  const provider = useWeb3Provider();
  const { getSigner } = useSigner();
  const [ptrdDeployerAddress, setPtrdDeployerAddress] =
    React.useState<string>('');
  const [metamaskAddress, setMetamaskAddress] = React.useState<string>('');

  const updateMetamaskAddress = async function () {
    const metamaskSigner = await getSigner();
    if (!metamaskSigner) {
      return;
    }
    const signerAddress = await metamaskSigner.getAddress();
    setMetamaskAddress(signerAddress);
  };

  React.useEffect(() => {
    if (!provider) {
      return;
    }
    const ptrdSigner = new ethers.Wallet(ptrdOwnerPrivateKey, provider);
    if (!ptrdSigner) return;

    const updatePtrdAddress = async function () {
      const signerAddress = await ptrdSigner.getAddress();
      setPtrdDeployerAddress(signerAddress);
    };

    updatePtrdAddress();
    updateMetamaskAddress();

    window.ethereum.on('accountsChanged', updateMetamaskAddress);

    return () => {
      window.ethereum.removeListener('accountsChanged', updateMetamaskAddress);
    };
  }, [provider]);

  const handleSelectChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('BBBBB', value);
    onSignerChange(value === 'metamaskProvider' ? undefined : value);
  };

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
          <option value={ptrdOwnerPrivateKey}>
            {formatAddress(ptrdDeployerAddress, 12)} (PTRD contract deployer)
          </option>
          <option value="metamaskProvider">
            {formatAddress(metamaskAddress, 14)} (Metamask account)
          </option>
        </Select>
        <Stack spacing="0.25em">
          <AddressCopy
            label="PTRD manager address:"
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
