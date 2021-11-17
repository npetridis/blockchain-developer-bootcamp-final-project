import React from 'react';
import { Accordion, Heading, Stack } from '@chakra-ui/react';
import { Card, AddressCopy } from 'components/common';
import {
  TotalSupply,
  Allowance,
  AllowanceFormProps,
  Approve,
  ApproveFormProps,
  Transfer,
  TransferFormProps,
  TransferFrom,
  TransferFromFormProps,
  BalanceOf,
  BalanceOfFormProps,
} from './operations';
import { useErc20Token } from 'hooks/useErc20Token';
import { BigNumber } from 'ethers';
import { useEnvVars, useToast } from 'hooks';
import { SignerSelector } from './SignerSelector';

export function PtrdControlPanel(): JSX.Element {
  const { petrideumErc20ContractAddress } = useEnvVars();
  const [signerPrivateKey, setSignerPrivateKey] = React.useState<
    string | undefined
  >();
  const {
    transfer,
    getTotalSupply,
    getBalanceOf,
    getAllowance,
    approve,
    transferFrom,
  } = useErc20Token(petrideumErc20ContractAddress, signerPrivateKey);
  const { successConfirmationToast, errorToast } = useToast();

  const handleTransfer = async ({ recipient, amount }: TransferFormProps) => {
    try {
      const txData = await transfer(recipient, BigNumber.from(amount));
      successConfirmationToast({ title: 'Transfer was successful!', txData });
    } catch (error: any) {
      errorToast({ error });
    }
  };

  const handleGetTotalSupply = async (): Promise<string> => {
    try {
      const data = await getTotalSupply();
      return data ? data.toString() : '0.0';
    } catch (error: any) {
      errorToast({ error });
    }
    return '0.0';
  };

  const handleGetBalanceOf = async ({
    address,
  }: BalanceOfFormProps): Promise<string> => {
    try {
      const data = await getBalanceOf(address);
      return data ? data?.toString() : '0.0';
    } catch (error: any) {
      errorToast({ error });
    }
    return '0.0';
  };

  const handleGetAllowance = async ({
    ownerAddress,
    spenderAddress,
  }: AllowanceFormProps) => {
    try {
      const data = await getAllowance(ownerAddress, spenderAddress);
      return data ? data?.toString() : '0.0';
    } catch (error: any) {
      errorToast({ error });
    }
    return '0.0';
  };

  const handleApprove = async ({ address, amount }: ApproveFormProps) => {
    try {
      const txData = await approve(address, BigNumber.from(amount));
      successConfirmationToast({ title: 'Approval was successful!', txData });
    } catch (error: any) {
      errorToast({ error });
    }
  };

  const handleTransferFrom = async ({
    sender,
    recipient,
    amount,
  }: TransferFromFormProps) => {
    try {
      const txData = await transferFrom(
        sender,
        recipient,
        BigNumber.from(amount)
      );
      successConfirmationToast({
        title: 'TransferFrom was successful!',
        txData,
      });
    } catch (error: any) {
      errorToast({ error });
    }
  };

  return (
    <Card maxW="500px">
      <Heading mb="4" fontSize="1.25em" color="text.regular">
        Petrideum(PTRD) control panel
      </Heading>
      <Stack spacing="1em">
        <Card py="1em" light>
          <AddressCopy
            label="PTRD contract address:"
            address={petrideumErc20ContractAddress}
          />
        </Card>
        <SignerSelector onSignerChange={setSignerPrivateKey} />
        <Card light maxH="52vh" overflowY="scroll">
          <Heading mb="4" fontSize="1em" color="background.white">
            ERC20 Operations
          </Heading>
          <Accordion defaultIndex={[0]} allowMultiple>
            <TotalSupply onClick={handleGetTotalSupply} />
            <BalanceOf onClick={handleGetBalanceOf} />
            <Transfer onClick={handleTransfer} />
            <Allowance onClick={handleGetAllowance} />
            <Approve onClick={handleApprove} />
            <TransferFrom onClick={handleTransferFrom} />
          </Accordion>
        </Card>
      </Stack>
    </Card>
  );
}
