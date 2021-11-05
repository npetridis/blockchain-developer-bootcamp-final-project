import React from 'react';
import { Web3Context } from './Web3Context';
// import { Web3Provider } from './Web3Provider';

export const useWeb3Provider = () => React.useContext(Web3Context);

export * from './Web3Provider';
