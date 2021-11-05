// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.9;

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title A smart contract wallet that stores ether and erc20 tokens
/// @author Nikolaos Petridis
/// @notice You can use this contract for only the most basic simulation
/// @dev All function calls are currently implemented without side effects
contract Wallet {
  using SafeERC20 for IERC20;

  mapping(address => uint256) private etherBalances; // user address => ether amount

  struct TokensLedger {
    address[] tokens;

    // uint tokenCounter;
    // mapping(uint => address) tokenIdToAddress;

    mapping(address => uint256) balances;
  }

  mapping(address => TokensLedger) private tokenBalances; // user address => token address => amount
  // mapping(address => mapping(address => uint256)) private tokenBalances; // user address => token address => amount
  // store user tokens? na dw pws to kanei sto supply chain kai sta sxetika, kapws me mapping kai counter

  event DepositEther(address indexed sender, uint256 amount, uint256 newTotalBalance);
  event WithdrawEther(address indexed to, uint256 amount, uint256 balance);
  event DepositERC20(address indexed sender, uint256 amount, address erc20Contract, uint256 newTotalBalance);
  event WithdrawERC20(address indexed to, uint256 amount, address erc20Contract, uint256 balance);

  // not necessary
  receive() external payable {
    if (msg.value > 0) {
      // Q: Does this uses SafeMath by default? 
      etherBalances[msg.sender] += msg.value;
      emit DepositEther(msg.sender, msg.value, etherBalances[msg.sender]);
    }
  }

  // Q: Does this need to be payable? Is there any reason to have it if I dont use it?
  fallback() external payable {
    revert();
    // if (msg.value > 0) {
    //   etherBalances[msg.sender] += msg.value;
    //   emit Deposit(msg.sender, msg.value, etherBalances[msg.sender]);
    // }
  }

  function getEtherBalance() external view returns (uint256) {
    return etherBalances[msg.sender];
  }

  // -> Probably not needed
  // function getUserEtherBalance(address user) external view returns (uint256) {
  //     return etherBalances[user];
  // }

  // -> Probably not needed
  // function totalEtherBalance() external view returns (uint256) {
  //     return address(this).balance;
  // }

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

  // -> Probably not needed
  // function transfer(address to, uint256 withdrawAmount) external returns (uint256) {
  //   require(withdrawAmount <= etherBalances[msg.sender], "Not enough ether balance");
  //   etherBalances[msg.sender] -= withdrawAmount;
  //   (bool success, ) = to.call{value: withdrawAmount}("");
  //   require(success, "Failed to withdraw Ether");
  //   emit Transfer(msg.sender, to, withdrawAmount, etherBalances[msg.sender]);
  //   return etherBalances[msg.sender];
  // }

  // ERC20

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
    uint256[] memory _balances = new uint256[](tokens.length);
    for (uint i = 0; i < tokens.length; i++) {
      _balances[i] = tokenBalances[msg.sender].balances[tokens[i]];
    }

    tokens = tokenBalances[msg.sender].tokens;
    balances = _balances;
  }

  // @notice Deposit ERC20 token to the wallet (requires sender approval first)
  // @param tokenAddress address of the ERC20 token contract
  // @param amount amount of ERC20 token to deposit
  // @return The ERC20 token balance of the sender
  // function depositToken(address tokenAddress, uint256 amount)
  //   public
  //   returns (uint256)
  // {
  //   ERC20 tokenContract = ERC20(tokenAddress);

  //   uint256 allowance = tokenContract.allowance(msg.sender, address(this));
  //   require(allowance >= amount, 'Not enough token allowance to complete the deposit');

  //   // Q: Is the += statement with safe math?
  //   tokenBalances[msg.sender][tokenAddress] += amount;
  //   tokenBalances[msg.sender][tokenAddress] += add(amount); // ??
  //   bool success = tokenContract.transferFrom(msg.sender, address(this), amount);
  //   require(success, 'The token transfer was not successful');

  //   emit DepositERC20(msg.sender, amount, tokenAddress, tokenBalances[msg.sender][tokenAddress]);
  //   return tokenBalances[msg.sender][tokenAddress];
  // }

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

  function addTokenBalance(address tokenAddress, uint amount) internal {
    if (!hasRegisteredToken(tokenAddress)) {
      tokenBalances[msg.sender].tokens.push(tokenAddress);
    }
    tokenBalances[msg.sender].balances[tokenAddress] += amount;
  }

  function depositToken(address tokenAddress, uint256 amount)
    public
    returns (uint256)
  {
    IERC20 token = IERC20(tokenAddress);

    uint256 allowance = token.allowance(msg.sender, address(this));
    require(allowance >= amount, 'Not enough token allowance to complete the deposit');

    // Q: Is the += statement with safe math?
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
