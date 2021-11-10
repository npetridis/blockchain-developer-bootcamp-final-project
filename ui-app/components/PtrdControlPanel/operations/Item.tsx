import React from 'react';
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Tag,
} from '@chakra-ui/react';

type ItemProps = {
  title: string;
  children: JSX.Element;
};

export function Item({ title, children }: ItemProps) {
  return (
    <AccordionItem>
      <h2>
        <AccordionButton justifyContent="space-between">
          <Tag textAlign="left">{title}</Tag>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={8}>{children}</AccordionPanel>
    </AccordionItem>
  );
}
