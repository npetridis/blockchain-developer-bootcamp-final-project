// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.9;

// Q: If I add Pausable functionality where should I declare it
// make all functions virtual and override them with relative modifier on parent contract?

/// @title An ether wallet that stores ether and erc20 tokens
/// @author Nikolaos Petridis
/// @notice You can use this contract for only the most basic simulation
/// @dev All function calls are currently implemented without side effects
contract EtherWallet {
  mapping(address => uint256) private etherBalances; // user address => ether amount

  event DepositEther(address indexed sender, uint256 amount, uint256 balance);
  event WithdrawEther(address indexed to, uint256 amount, uint256 balance);

  // not necessary
  receive() external payable virtual {
    if (msg.value > 0) {
      // Q: Does this uses SafeMath by default? 
      etherBalances[msg.sender] += msg.value;
      emit DepositEther(msg.sender, msg.value, etherBalances[msg.sender]);
    }
  }

  // Q: Does this need to be payable? Is there any reason to have it if I dont use it?
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
  function withdrawEther(uint256 amount) external returns (uint256) {
    require(amount <= etherBalances[msg.sender], "Not enough ether balance");
    
    etherBalances[msg.sender] -= amount;
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Failed to withdraw Ether"); // Q: is assert a better match?
    
    emit WithdrawEther(msg.sender, amount, etherBalances[msg.sender]);
    
    return etherBalances[msg.sender];
  }
}
