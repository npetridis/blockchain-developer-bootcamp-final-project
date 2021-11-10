import React from 'react';
import type { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import { useBlockNumber, useWallet, useErc20Token, useSigner } from 'hooks';
import { Card } from 'components/common';
import { Button, HStack, Text, Heading, Input, Stack } from '@chakra-ui/react';
import { BigNumber, utils } from 'ethers';
// import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const { isConnected, signerAddress, connectWallet } = useWallet();
  const { connectSigner, getSigner } = useSigner();
  const { blockNumber } = useBlockNumber();
  const { name, symbol, totalSupply, getAddressBalance, transfer } =
    useErc20Token(process.env.NEXT_PUBLIC_PETRIDEUM_ERC20_ADDRESS as string);
  const [maxBalance, setMaxBalance] = React.useState('0');
  const { register, getValues } = useForm();

  getAddressBalance('0x01758d6FB2B77D4D7206b0D080FF63e8BE1D156B').then(
    (balance) => console.log('PTRD balance', balance?.toString())
  );

  React.useEffect(() => {
    if (!signerAddress) {
      return;
    }
    getAddressBalance(signerAddress)
      .then((balance) => setMaxBalance(balance ? balance.toString() : '0'))
      .catch((error) => setMaxBalance('0'));
  });

  const handleWithdraw = async () => {
    if (!signerAddress) return;
    const amount = BigNumber.from(456);
    const recipientAddress = getValues('withdrawAddress');
    console.log('recipientAddress', recipientAddress);
    console.log('amount big number', amount.toString());

    const success = await transfer(recipientAddress, amount.toString());
    console.log('success', success);
    // TODO: how do I get the confirmation and the new state?
  };

  const handleEthTransfer = async () => {
    if (!signerAddress) return;
    const amount = getValues('transferEther');

    const signer = getSigner();
    signer.sendTransaction({
      to: '0xf18fFB293E79f894E9e8Ce66c906C606F1306263',
      value: utils.parseEther('1.0'),
    });
  };

  // signer?.getAddress().then((data) => console.log('data', data));

  return (
    <Card>
      <Heading mb="4" color="white">
        ERC20 Wallet
      </Heading>
      <Text color="white">Block number {blockNumber}</Text>
      <Text color="white">Name {name}</Text>
      <Text color="white">Symbol {symbol}</Text>
      <Text color="white">Total supply {totalSupply.toString()}</Text>
      {isConnected ? (
        <Stack>
          <>
            <HStack>
              <Input
                type="text"
                placeholder="Withdraw address"
                {...register('withdrawAddress')}
                disabled={!signerAddress}
              />
              <Input
                type="text"
                placeholder="Withdraw amount"
                {...register('transferEther')}
                disabled={!signerAddress}
              />
              <Button disabled={!signerAddress} onClick={handleWithdraw}>
                Transfer PTRD
              </Button>
            </HStack>
            <Text>Max: {maxBalance}</Text>
          </>
          <HStack>
            <Input
              type="text"
              placeholder="Trasfer ether"
              {...register('transferEth')}
              disabled={!signerAddress}
            />
            <Button disabled={!signerAddress} onClick={handleEthTransfer}>
              Transfer Ether
            </Button>
          </HStack>
        </Stack>
      ) : (
        <>
          <Text>Connect wallet to access functionality</Text>
          <Button onClick={connectWallet}>Connect wallet</Button>
        </>
      )}
      <HStack mt="4" spacing="4">
        <Button onClick={() => {}}>Contract CTA</Button>
      </HStack>
    </Card>
  );
};

export default Home;