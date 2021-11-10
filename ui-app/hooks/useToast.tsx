import React from 'react';
import { useToast as useChakraToast } from '@chakra-ui/react';

type SuccessToastProps = {
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
};

type SuccessTransactionToastProps = {
  title: string | React.ReactNode;
  txData?: {
    confirmations?: number;
    blockNumber?: number;
    transactionHash?: string;
  };
};

type ErrorToastProps = {
  error?: { message?: string; value?: string };
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
};

export const useToast = () => {
  const toast = useChakraToast();

  const successToast = React.useCallback(
    ({ title, description }: SuccessToastProps) => {
      toast({
        position: 'bottom-right',
        status: 'success',
        isClosable: true,
        title,
        description,
      });
    },
    [toast]
  );

  const successTransactionToast = ({
    title,
    txData,
  }: SuccessTransactionToastProps) => {
    const confirmationsLiteral = txData
      ? `(confirmations: ${txData?.confirmations || 1})`
      : '';
    successToast({
      title: `${title} ${confirmationsLiteral}`,
      description: txData ? (
        <>
          <div>Block number: {txData?.blockNumber}</div>
          <div>
            Tx hash: <div>{txData?.transactionHash}</div>
          </div>
        </>
      ) : null,
    });
  };

  const errorToast = React.useCallback(
    ({ error, title, description }: ErrorToastProps) => {
      toast({
        position: 'bottom-right',
        status: 'error',
        isClosable: true,
        title: title || 'An error occurred',
        description:
          error?.message ||
          error?.value ||
          description ||
          'Please try again later!',
      });
    },
    [toast]
  );

  return {
    successToast,
    errorToast,
    successTransactionToast,
  };
};
