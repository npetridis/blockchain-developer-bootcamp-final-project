# Design pattern decisions

The DefiVault smart contracts uses the following design patterns

## Inter-Contract Execution

* Interacts with Compound.finance protocol by supplying Erc20 tokens(mint) and redeeming cTokens(redeem)
* Uses Open Zeppelin's ERC20 and SafeERC20 to interact with any ERC20 tokens

## Inheritance and Interfaces

* Inherits from Open Zeppelin's ReentrancyGuard and applies nonReentrant modifer to `withdrawEther`, `withdrawToken` and `redeemCErc20Tokens`
* Interacts with Compound.finance protocol by using an interface (CErc20.sol)
