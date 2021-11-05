import React from 'react';
import { Box } from '@chakra-ui/react';

interface CardContainerProps {
  children: React.ReactNode;
  disabled?: boolean;
  opaque?: boolean;
  nonClickable?: boolean;
}

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
      // borderColor={cssVars.border}
      bg="gray.500"
      flex="1"
      py="2rem"
      px={6}
      rounded="2xl"
      style={getStyles()}
    >
      {children}
    </Box>
  );
}
