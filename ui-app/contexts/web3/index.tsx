import React from 'react';
import { Web3Context } from './Web3Context';

export const useWeb3Provider = () => React.useContext(Web3Context);

export * from './Web3Provider';
