// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.9;

///@title Compound's CErc20 Contract Interface
///@notice interface for DefiVault contract to interact with Compound
///@dev refer to https://github.com/compound-finance/compound-protocol/blob/master/contracts/CErc20.sol for further details
interface CErc20 {
  function mint(uint256) external returns (uint256);
 
  function redeem(uint) external returns (uint);

  function balanceOf(address owner) external view returns (uint256);

  function underlying() external returns (address);
}
