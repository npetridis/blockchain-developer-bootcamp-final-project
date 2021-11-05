## Run tests

```
truffle test ./test/TestMetaCoin.sol
truffle test ./test/metacoin.js
```

## Compile

```
truffle compile
```

## Deploy

```
truffle migrate
```

## Console to interact with the contracts

```
truffle console
```

### Examples

```
let instance = await MetaCoin.deployed()
let accounts = await web3.eth.getAccounts()
let balance = await instance.getBalance(accounts[0])
balance.toNumber()

// for ERC20
let balance = await instance.balanceOf(accounts[1])
balance.toString()
```
