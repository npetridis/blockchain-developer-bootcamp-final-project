import React from 'react';
import { Box, Button, ButtonProps, HStack, Tooltip } from '@chakra-ui/react';
import { AppModes } from './types';
import { useAppMode } from 'hooks/useAppMode';
import Link from 'next/link';
import { InfoOutlineIcon } from '@chakra-ui/icons';

type MenuButtonProps = {
  isActive?: boolean;
} & ButtonProps;

const MenuButton = React.forwardRef(
  (
    { isActive, ...rest }: MenuButtonProps,
    ref: React.Ref<HTMLButtonElement>
  ) => (
    <Button
      ref={ref}
      data-active={isActive ? true : undefined}
      variant="ghost"
      color="text.regular"
      borderRadius="2xl"
      _hover={{
        color: 'text.hover',
      }}
      _active={{
        bg: 'background.light',
      }}
      {...rest}
    />
  )
);

export function Menu() {
  const mode = useAppMode();

  return (
    <HStack
      justifySelf="center"
      zIndex="2"
      bg="background.light"
      borderRadius="3xl"
      pr="6px"
    >
      <HStack
        justifySelf="center"
        borderRadius="2xl"
        bg="background.dark"
        p="6px"
      >
        <Link href={`/${AppModes.Ether}`} passHref>
          <MenuButton as="a" isActive={mode === AppModes.Ether}>
            Ether
          </MenuButton>
        </Link>
        <Link href={`/${AppModes.ERC20}`} passHref>
          <MenuButton as="a" isActive={mode === AppModes.ERC20}>
            ERC20
          </MenuButton>
        </Link>
      </HStack>
      <Link href={`/${AppModes.PTRD}`} passHref>
        <MenuButton
          as="a"
          isActive={mode === AppModes.PTRD}
          _active={{
            bg: 'background.dark',
          }}
        >
          <Tooltip label="Tab for managing Test Erc20 (PTRD)">
            <Box>
              PTRD <InfoOutlineIcon w="16px" h="16px" ml="4px" />
            </Box>
          </Tooltip>
        </MenuButton>
      </Link>
    </HStack>
  );
}
