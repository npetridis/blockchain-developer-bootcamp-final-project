// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.9;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/utils/Address.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import "./CErc20.sol";
import "./EtherWallet.sol";

/// @title A smart contract wallet that stores ether and erc20 tokens and supplies erc20 tokens to compound.finance
/// @author Nikolaos Petridis
/// @notice You can use this contract for only the most basic simulation
/// @dev All function calls are currently implemented without side effects
contract DefiVault is ReentrancyGuard, EtherWallet {
  using SafeERC20 for ERC20;
  using Address for address;

  struct TokensLedger {
    address[] tokens;

    uint tokenRegistryCount;
    mapping(uint => address) tokenIdToAddress;

    // erc20 token address => user amount
    mapping(address => uint256) balances;
  }

  // user address => user wallet
  mapping(address => TokensLedger) private tokenBalances;

  event DepositERC20(address indexed sender, uint256 amount, address erc20Contract, uint256 newTotalBalance);
  event WithdrawERC20(address indexed to, uint256 amount, address erc20Contract, uint256 newTotalBalance);
  event SupplyERC20(address indexed owner, address underlyingErc20Contract, uint256 suppliedErc20Amount, address cErc20Contract, uint256 mintedCTokenAmount);
  event RedeemERC20(address indexed owner, address cErc20Contract, uint256 suppliedCTokenAmount, address underlyingErc20Contract, uint256 redeemedErc20Amount);

  fallback() external payable override {
    revert();
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
  function hasRegisteredToken(address tokenAddress) private view returns (bool) {
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
  function addTokenBalance(address tokenAddress, uint amount) private {
    if (!hasRegisteredToken(tokenAddress)) {
      tokenBalances[msg.sender].tokens.push(tokenAddress);
    }
    tokenBalances[msg.sender].balances[tokenAddress] += amount;
  }

  /// @notice Deposit ERC20 token to the wallet (requires sender approval first)
  /// @param tokenAddress address of the ERC20 token contract
  /// @param amount amount of ERC20 token to deposit
  /// @return The ERC20 token balance of the sender
  function depositToken(address tokenAddress, uint256 amount)
    external
    returns (uint256)
  {
    require(
      tokenAddress.isContract() && tokenAddress != address(0),
      'Not a valid contract address'
    );
    ERC20 token = ERC20(tokenAddress);

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
  function withdrawToken(
    address tokenAddress,
    uint256 amount
  ) external nonReentrant returns (uint256) {
    require(
      tokenAddress.isContract() && tokenAddress != address(0),
      'Not a valid contract address'
    );

    uint256 tokenBalance = tokenBalances[msg.sender].balances[tokenAddress];
    require(amount <= tokenBalance, "Not enough token balance");

    tokenBalances[msg.sender].balances[tokenAddress] -= amount;

    ERC20 token = ERC20(tokenAddress);
    token.safeTransfer(msg.sender, amount);

    emit WithdrawERC20(msg.sender, amount, tokenAddress, tokenBalances[msg.sender].balances[tokenAddress]);
    return tokenBalances[msg.sender].balances[tokenAddress];
  }

  /// @notice Supply compatible ERC20 token to Compound.finance
  /// @param _erc20Contract address of the underlying ERC20 token contract
  /// @param _cErc20Contract address of the cToken ERC20 contract
  /// @param _numTokensToSupply amount of ERC20 tokens to supply to Compound.finance
  /// @return 0 when success
  function supplyErc20ToCompound(
    address _erc20Contract,
    address _cErc20Contract,
    uint256 _numTokensToSupply
  ) external returns (uint) {
    require(
      _erc20Contract.isContract() && _erc20Contract != address(0),
      'Not a valid contract address (_erc20Contract)'
    );
    require(
      _cErc20Contract.isContract() && _cErc20Contract != address(0),
      'Not a valid contract address (_cErc20Contract)'
    );
    // Create a reference to the underlying asset contract, like DAI.
    ERC20 underlying = ERC20(_erc20Contract);

    // Create a reference to the corresponding cToken contract, like cDAI
    CErc20 cToken = CErc20(_cErc20Contract);

    uint256 underlyingTokenBalance = tokenBalances[msg.sender].balances[_erc20Contract];
    require(underlyingTokenBalance >= _numTokensToSupply, 'Not enough erc20 token balance to supply');
    tokenBalances[msg.sender].balances[_erc20Contract] -= _numTokensToSupply;

    underlying.approve(_cErc20Contract, _numTokensToSupply);

    uint256 cTokenBalanceBefore = cToken.balanceOf(address(this));
    // Mint cTokens
    uint mintResult = cToken.mint(_numTokensToSupply);
    require(mintResult == 0, 'Minting failed');

    uint256 cTokenBalanceAfter = cToken.balanceOf(address(this));
    uint256 cTokenBalanceDiff = cTokenBalanceAfter - cTokenBalanceBefore;

    addTokenBalance(_cErc20Contract, cTokenBalanceDiff);

    emit SupplyERC20(msg.sender, _erc20Contract, _numTokensToSupply, _cErc20Contract, cTokenBalanceDiff);
    return mintResult;
  }

  /// @notice Redeem cToken to underlying ERC20 token from Compound.finance
  /// @param _cTokenAmount amount of cTokens to redeem from Compound.finance
  /// @param _cErc20Contract address of the cToken ERC20 contract
  /// @return amount of ERC20 tokens that was redeemed back from Compound.finance
  function redeemCErc20Tokens(
    uint256 _cTokenAmount,
    address _cErc20Contract
  ) external nonReentrant returns (uint256) {
    require(
      _cErc20Contract.isContract() && _cErc20Contract != address(0),
      'Not a valid contract address'
    );
    
    // Create a reference to the corresponding cToken contract
    CErc20 cToken = CErc20(_cErc20Contract);

    uint256 userCTokenBalance = tokenBalances[msg.sender].balances[_cErc20Contract];
    require(_cTokenAmount <= userCTokenBalance, 'Not enough cToken balance');

    address underlyingContract = cToken.underlying();
    ERC20 underlying = ERC20(underlyingContract);

    tokenBalances[msg.sender].balances[_cErc20Contract] -= _cTokenAmount;

    uint256 erc20BalanceBefore = underlying.balanceOf(address(this));
    uint256 redeemResult = cToken.redeem(_cTokenAmount);
    require(redeemResult == 0, 'CToken Redemption failed');
    uint256 erc20BalanceAfter = underlying.balanceOf(address(this));

    uint256 erc20BalanceDiff = erc20BalanceAfter - erc20BalanceBefore;

    addTokenBalance(underlyingContract, erc20BalanceDiff);

    emit RedeemERC20(msg.sender, _cErc20Contract, _cTokenAmount, underlyingContract, erc20BalanceDiff);
    return erc20BalanceDiff;
  }
}
