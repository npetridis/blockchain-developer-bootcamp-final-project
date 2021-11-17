import React from 'react';
import { useToast as useChakraToast } from '@chakra-ui/react';

type SuccessToastProps = {
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
};

type SuccessTransctionToastProps = {
  txHash: string;
};

type SuccessConfirmationToastProps = {
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

const TOAST_DURATION = 10000;

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
        duration: TOAST_DURATION
      });
    },
    [toast]
  );

  const successTransactionToast = ({ txHash }: SuccessTransctionToastProps) => {
    successToast({
      title: 'Transaction was successful',
      description: (
        <>
          <div>Waiting for confirmation...</div>
          <div>
            Tx hash: <div>{txHash}</div>
          </div>
        </>
      )
    });
  };

  const successConfirmationToast = ({
    title,
    txData,
  }: SuccessConfirmationToastProps) => {
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
        duration: TOAST_DURATION
      });
    },
    [toast]
  );

  return {
    successToast,
    errorToast,
    successTransactionToast,
    successConfirmationToast
  };
};
