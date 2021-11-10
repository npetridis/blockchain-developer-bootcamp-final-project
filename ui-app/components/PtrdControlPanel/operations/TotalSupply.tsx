import React from 'react';
import { Box, FormLabel, Input, Stack } from '@chakra-ui/react';
import { Button } from 'components/common';
import { Item } from './Item';

type TotalSupplyProps = {
  onClick: () => Promise<string>;
};

export function TotalSupply({ onClick }: TotalSupplyProps) {
  const [result, setResult] = React.useState('0.0');

  const handleClick = async () => {
    const totalSupply = await onClick();
    setResult(totalSupply);
  };

  return (
    <Item title="totalSupply">
      <Stack spacing="0.75em">
        <Button w="full" onClick={handleClick}>
          Get Total Supply
        </Button>
        <Box>
          <FormLabel>Result:</FormLabel>
          <Input
            readOnly
            value={result}
            pointerEvents="none"
            borderColor="gray.600"
          />
        </Box>
      </Stack>
    </Item>
  );
}
