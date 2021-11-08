import React from 'react';
import { ButtonProps, Button as ButtonChakra } from '@chakra-ui/react';

export function Button(props: ButtonProps): JSX.Element {
  return (
    <ButtonChakra
      bg="background.light"
      color="text.regular"
      type="submit"
      _hover={{ color: 'text.dark', bg: 'background.white' }}
      {...props}
    />
  );
}
