# Avoiding Common Attacks

The DefiVault smart contracts apply the following security measures against the mentioned attack vectors.

## Reenetrancy - <a href='https://swcregistry.io/docs/SWC-107'>[SWC-107]</a>

* Use Open Zeppelin's ReentrancyGuard to safeguard against reentrancy attack.
* Use Checks-Effects-Interactions in the `withdrawEther`, `withdrawToken` and `redeemCErc20Tokens` functions.

## Use msg.sender over tx.origin - <a href='https://swcregistry.io/docs/SWC-115'>[SWC-115]</a>

All functions use `msg.sender` instead of the `tx.origin`.

## Use specific pragma compile - <a href='https://swcregistry.io/docs/SWC-103'>[SWC-103]</a>

All contracts use a specific version of compiler (version: `0.8.9`). 

## Verify `call` function return value - <a href='https://swcregistry.io/docs/SWC-104'>[SWC-104]</a>

The return value of low-level `call` function is checked for success.

## Pull over push

"Pull over Push" practice is used for all balance withdrawals.

## Use require for important checks

`require` is used to check the eligibility of balances and allowances, addresses validity and low level calls success  .

## Use Open Zeppelin's libraries
ERC20, SafeERC20, Address and ReentrancyGuard libraries have been used.
