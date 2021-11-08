import React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

type CardContainerProps = {
  children: React.ReactNode;
  disabled?: boolean;
  opaque?: boolean;
  nonClickable?: boolean;
  light?: boolean;
} & BoxProps;

const MAKE_OPAQUE_STYLE: React.CSSProperties = {
  opacity: '0.5',
};

const DISABLE_POINTER_STYLE: React.CSSProperties = {
  pointerEvents: 'none',
};

export function Card({
  disabled,
  nonClickable,
  opaque,
  children,
  light,
  ...rest
}: CardContainerProps): JSX.Element {
  const getStyles = (): React.CSSProperties => {
    return {
      ...(nonClickable || disabled ? DISABLE_POINTER_STYLE : {}),
      ...(disabled || opaque ? MAKE_OPAQUE_STYLE : {}),
    };
  };

  return (
    <Box
      border="1px solid"
      bg={light ? 'background.active' : 'background.dark'}
      flex="1"
      py="2rem"
      px={6}
      rounded="2xl"
      style={getStyles()}
      {...rest}
    >
      {children}
    </Box>
  );
}
