import React from 'react';
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  Input,
  Stack,
} from '@chakra-ui/react';
import { Card, Button } from 'components/common';

type ItemProps = {
  title: string;
  children: JSX.Element;
};

export function Item({ title, children }: ItemProps) {
  return (
    <AccordionItem>
      <h2>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            {title}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        {children}
        {/* <Stack>
          <Input readOnly value="0.0" pointerEvents="none" />
          <Button w="full">Get Total Supply</Button>
        </Stack> */}
      </AccordionPanel>
    </AccordionItem>
  );
}
