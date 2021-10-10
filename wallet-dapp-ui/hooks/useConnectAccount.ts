import React from 'react';

export const useConnectAccount = () => {
  const [isConnecting, setIsConnecting] = React.useState<boolean>();

  // React.useEffect(() => {
  //   const enableEth = async () => await window.ethereum.enable();
  //   enableEth();
  // }, []);

  const connectAccount = React.useCallback(async () => {
    setIsConnecting(true);
    await window.ethereum.enable();
    setIsConnecting(false);
  }, []);

  const isConnected = React.useCallback(() => {
    if (typeof window !== "undefined") {
      return window.ethereum.isConnected();
    }
    return false;
  }, []);

  return {
    connectAccount,
    isConnecting,
    isConnected
  }
}
