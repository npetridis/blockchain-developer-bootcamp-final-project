import React from 'react';
import {
  Heading,
  Select,
  Text,
  Code,
  HStack,
  Stack,
  Box,
  useClipboard,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import { Button, Card } from 'components/common';
import { useSigner, useToast } from 'hooks';
import { useWeb3Provider } from 'contexts/web3';
import { formatAddress } from 'utils';
import { CopyIcon } from '@chakra-ui/icons';

const ptrdOwnerPrivateKey = process.env
  .NEXT_PUBLIC_PETRIDEUM_OWNER_PRIVATE_KEY as string;

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
  const { successToast, errorToast } = useToast();
  const { onCopy: onCopyPtrd } = useClipboard(ptrdDeployerAddress);
  const { onCopy: onCopyMtmk } = useClipboard(metamaskAddress);

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
        <Box>
          <HStack mb="0.25em">
            <Text w="205px">PTRD manager address:</Text>
            <Code cursor="pointer" onClick={onCopyPtrd}>
              {formatAddress(ptrdDeployerAddress, 8)}
            </Code>
            <CopyIcon
              color="white"
              cursor="pointer"
              onClick={onCopyPtrd}
              _hover={{ color: 'blue.200' }}
            />
          </HStack>
          <HStack>
            <Text w="205px">Metamask account address:</Text>
            <Code cursor="pointer" onClick={onCopyMtmk}>
              {formatAddress(metamaskAddress, 8)}
            </Code>
            <CopyIcon
              color="white"
              cursor="pointer"
              onClick={onCopyMtmk}
              _hover={{ color: 'blue.200' }}
            />
          </HStack>
        </Box>
      </Stack>
    </Card>
  );
}
