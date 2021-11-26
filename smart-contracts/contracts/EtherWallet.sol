// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.9;

import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

/// @title Ether management Wallet contract
/// @author Nikolaos Petridis
/// @notice deposit and witdraw ether in a smart contract
contract EtherWallet is ReentrancyGuard {
  mapping(address => uint256) private etherBalances; // user address => ether amount

  event DepositEther(address indexed sender, uint256 amount, uint256 balance);
  event WithdrawEther(address indexed to, uint256 amount, uint256 balance);

  /// @notice Deposit ether to wallet
  receive() external payable virtual {
    if (msg.value > 0) {
      // Q: Does this uses SafeMath by default? 
      etherBalances[msg.sender] += msg.value;
      emit DepositEther(msg.sender, msg.value, etherBalances[msg.sender]);
    }
  }

  /// @notice fallback always reverts because if ether is
  /// @notice sent by accident it cannot be withdrawn
  fallback() external payable virtual {
    revert();
  }

  /// @notice Get the ether balance of the sender
  /// @return The ether balance of the sender
  function getEtherBalance() external view returns (uint256) {
    return etherBalances[msg.sender];
  }

  /// @notice Deposit ether to wallet
  /// @return The new ether balance of the sender
  function depositEther() external payable returns (uint256) {
    if (msg.value > 0) {
      etherBalances[msg.sender] += msg.value;
      emit DepositEther(msg.sender, msg.value, etherBalances[msg.sender]);
    }
    return etherBalances[msg.sender];
  }

  /// @notice Withdraw ether from wallet to sender address
  /// @param amount ether amount you want to withdraw
  /// @return The new ether balance of the sender
  function withdrawEther(uint256 amount) external nonReentrant returns (uint256) {
    require(amount <= etherBalances[msg.sender], "Not enough ether balance");
    
    etherBalances[msg.sender] -= amount;
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Failed to withdraw Ether");
    
    emit WithdrawEther(msg.sender, amount, etherBalances[msg.sender]);
    
    return etherBalances[msg.sender];
  }
}
