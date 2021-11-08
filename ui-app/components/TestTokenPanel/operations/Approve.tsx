import React from 'react';
import { Input, Stack } from '@chakra-ui/react';
import { Button } from 'components/common';
import { Item } from '../Item';

type ApproveProps = {
  onClick: () => {};
};

export function Approve({ onClick }: ApproveProps) {
  return (
    <Item title="totalSupply">
      <Stack>
        <Input readOnly value="0.0" pointerEvents="none" />
        <Button w="full" onClick={onClick}>
          Get Total Supply
        </Button>
      </Stack>
    </Item>
  );
}
