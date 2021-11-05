import React from 'react';
import { ethers } from 'ethers';

export type Web3Provider = ethers.providers.Web3Provider | null;

export const Web3Context = React.createContext<Web3Provider>(null);
