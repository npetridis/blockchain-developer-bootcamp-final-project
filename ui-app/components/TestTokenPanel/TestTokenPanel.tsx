import React from 'react';
import { Accordion, Heading } from '@chakra-ui/react';
import { Card } from 'components/common';
import {
  TotalSupply,
  Allowance,
  Approve,
  Transfer,
  TransferFrom,
} from './operations';

export function TestTokenPanel(): JSX.Element {
  return (
    <Card maxW="500px">
      <Heading mb="4" fontSize="1.25em" color="text.regular">
        Petrideum control panel
      </Heading>
      <Card light>
        <Heading mb="4" fontSize="1em" color="background.white">
          ERC20 Operations
        </Heading>
        <Accordion defaultIndex={[0]} allowMultiple>
          <TotalSupply onClick={() => {}} />
          <TotalSupply onClick={() => {}} />
          <TotalSupply onClick={() => {}} />
          <TotalSupply onClick={() => {}} />
          {/* <Item title="balanceOf" />
          <Item title="transfer" />
          <Item title="allowance" />
          <Item title="approve" />
          <Item title="transferFrom" /> */}
        </Accordion>
      </Card>
    </Card>
  );
}
