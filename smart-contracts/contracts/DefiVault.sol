// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.9;

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/utils/SafeERC20.sol";

import "./EtherWallet.sol";

/// @title A smart contract wallet that stores ether and erc20 tokens
/// @author Nikolaos Petridis
/// @notice You can use this contract for only the most basic simulation
/// @dev All function calls are currently implemented without side effects
contract DefiVault is EtherWallet {
  using SafeERC20 for IERC20;

  struct TokensLedger {
    address[] tokens;

    uint tokenRegistryCount;
    mapping(uint => address) tokenIdToAddress;

    // erc20 token address => user amount
    mapping(address => uint256) balances;
  }

  mapping(address => TokensLedger) private tokenBalances; // user address => user wallet

  event DepositERC20(address indexed sender, uint256 amount, address erc20Contract, uint256 newTotalBalance);
  event WithdrawERC20(address indexed to, uint256 amount, address erc20Contract, uint256 balance);

  // Q: Does this need to be payable? Is there any reason to have it if I dont use it?
  fallback() external payable override {
    revert();
    // if (msg.value > 0) {
    //   etherBalances[msg.sender] += msg.value;
    //   emit Deposit(msg.sender, msg.value, etherBalances[msg.sender]);
    // }
  }

  /// @notice Get the ERC20 token balance of the sender
  /// @param tokenAddress address of the ERC20 token contract
  /// @return The requested token balance of the sender
  function getTokenBalance(address tokenAddress)
    public
    view
    returns (uint256)
  {
    return tokenBalances[msg.sender].balances[tokenAddress];
  }

  /// @notice Get the user ERC20 tokens and their balances
  /// @return tokens The requested token balance of the sender
  /// @return balances The requested token balance of the sender
  function getTokens() public view returns (address[] memory tokens, uint256[] memory balances) {
    address[] memory userTokens = tokenBalances[msg.sender].tokens;
    uint256[] memory _balances = new uint256[](userTokens.length);
    for (uint i = 0; i < userTokens.length; i++) {
      address tokenAddress = userTokens[i];
      _balances[i] = tokenBalances[msg.sender].balances[tokenAddress];
    }

    tokens = tokenBalances[msg.sender].tokens;
    balances = _balances;
  }

  /// @notice Returns true when the sender has already registered the requested token address
  /// @param tokenAddress address of the ERC20 token contract
  /// @return True if the sender has registered the token, false otherwise
  function hasRegisteredToken(address tokenAddress) internal view returns (bool) {
    // if user has balance > 0 the token is already registered
    if (tokenBalances[msg.sender].balances[tokenAddress] > 0) {
      return true;
    }

    address[] memory userTokens = tokenBalances[msg.sender].tokens;
    // if token exists in userTokens then it is registered
    for (uint i = 0; i < userTokens.length; i++) {
      if (userTokens[i] == tokenAddress) {
        return true;
      }
    }
    return false;
  }

  /// @notice Updates users token ledger balance by registering it in the tokens list and adding the deposited amount
  /// @param tokenAddress address of the ERC20 token contract
  /// @param amount amount to be added to the token balance
  function addTokenBalance(address tokenAddress, uint amount) internal {
    if (!hasRegisteredToken(tokenAddress)) {
      tokenBalances[msg.sender].tokens.push(tokenAddress);
    }
    // Q: Is the += statement with safe math?
    tokenBalances[msg.sender].balances[tokenAddress] += amount;
  }

  /// @notice Deposit ERC20 token to the wallet (requires sender approval first)
  /// @param tokenAddress address of the ERC20 token contract
  /// @param amount amount of ERC20 token to deposit
  /// @return The ERC20 token balance of the sender
  function depositToken(address tokenAddress, uint256 amount)
    public
    returns (uint256)
  {
    IERC20 token = IERC20(tokenAddress);

    uint256 allowance = token.allowance(msg.sender, address(this));
    require(allowance >= amount, 'Not enough token allowance to complete the deposit');

    addTokenBalance(tokenAddress, amount);
    token.safeTransferFrom(msg.sender, address(this), amount);

    emit DepositERC20(msg.sender, amount, tokenAddress, tokenBalances[msg.sender].balances[tokenAddress]);
    return tokenBalances[msg.sender].balances[tokenAddress];
  }

  /// @notice Withdraw ERC20 token to the sender's address
  /// @param tokenAddress address of the ERC20 token contract
  /// @param amount amount of ERC20 token to withdraw
  /// @return The ERC20 token balance of the sender
  function withdrawToken(address tokenAddress, uint256 amount)
    public
    returns (uint256)
  {
    uint256 tokenBalance = tokenBalances[msg.sender].balances[tokenAddress];
    require(amount <= tokenBalance, "Not enough token balance");

    // Avoids reentancy SWC-107, Q: is it enough or I need a reentrancy guard modifier?
    tokenBalances[msg.sender].balances[tokenAddress] -= amount;

    IERC20 token = IERC20(tokenAddress);
    token.safeTransfer(msg.sender, amount);
    // Q: Could the user provide a malicious contract address that has no tranfer function
    // and that by executing his own code in fallback function could exploit this contract?

    emit WithdrawERC20(msg.sender, amount, tokenAddress, tokenBalances[msg.sender].balances[tokenAddress]);
    return tokenBalances[msg.sender].balances[tokenAddress];
  }
}
