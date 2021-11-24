# Blockchain developer bootcamp final project

## Idea 1: Decentralized User Authentication

### We have two roles:

- <b>Business Owner</b>: the user that will interact with the smart contract through the web3 website and add a whitelist of public addresses that can access his website or services.
- <b>Client</b>: the client that the Business owner has given a private key so that he can sign in to his business website by signing in through the smart contract.

### Happy path

1. The Business Owner creates offline (private key, public address) pairs for his clients and distributes to them each private key
2. The Business Owner creates account through the smart contract UI.
3. The Business Owner registers the whitelisted public addresses to his account.  
   These public addresses will have access to his services through our smart contract (verify with their private keys).
4. A Client will finally visit the Business Owner's website and sign in with his metamask by interacting with the smart contract.  
   His metamask will be seeded with the private key the Business Owner gave him in the first step.

### UI Components

- Web3 UI where the Business Owner will interact with the smart contract and register his whitelisted public addresses.
- The Business Owner's website that will have a web3 snippet that will allow it's users to sign in by interacting with the smart contract.

## Idea 2: Wallet that stores ERC20 tokens and invests them on compound.finance

### Description

- The user will be able to view, deposit and withdraw funds (ether and ERC20 tokens)
- The user will be able, through a UI toggle, to invest the selected funds through compound.finance

### TODO

- Make contract Pausable to be prepared for bugs, Circui breaker design pattern
- Manage the amount of money at risk with `rate limiting` or `caps` and setup an effective upgrade path for bug fixes and improvements
- Do not to use send and transfer, and instead use call.value
- Use withdrawal pattern and push-pull
- To avoid front-running use commit - reveal pattern
- Reentrancy (change the balance and then send the money) check 3 word rule on relative section
- Reentrancy vs push pull withdrawal pattern

Checks-Effects-Interactions
Avoid state changes after external calls, to avoid things like the DAO hack:

function withdraw(uint amount) public { // Possibly dangerous
require(balances[msg.sender] >= amount);
msg.sender.call.value(amount)("");
balances[msg.sender] -= amount;
}

function withdraw(uint amount) public { // Better!
require(balances[msg.sender] >= amount);
balances[msg.sender] -= amount;
msg.sender.call.value(amount)("");
}

### Contract links on ropsten

Compound (COMP)
0xf76D4a441E4ba86A923ce32B89AFF89dBccAA075
https://ropsten.etherscan.io/token/0xf76D4a441E4ba86A923ce32B89AFF89dBccAA075#readContract

Compound COMP (cCOMP)
0x70014768996439f71c041179ffddce973a83eef2
https://ropsten.etherscan.io/token/0x70014768996439f71c041179ffddce973a83eef2

To get COMP:
  * get ropsten ETH from (faucet link)
  * go to https://app.uniswap.org/#/swap add COMP(0xf76D4a441E4ba86A923ce32B89AFF89dBccAA075) as exchange token
  * exchange ETH with the imported COMP

Tether USD (USDT)
0x110a13fc3efe6a245b50102d2d79b3e76125ae83
https://ropsten.etherscan.io/token/0x110a13fc3efe6a245b50102d2d79b3e76125ae83#readContract

Compound USDT (cUSDT)
0xf6958cf3127e62d3eb26c79f4f45d3f3b2ccded4
https://ropsten.etherscan.io/token/0xf6958cf3127e62d3eb26c79f4f45d3f3b2ccded4


The most likely reason for this error is that you are using "string" data type for URIs, and so the compiler naturally cannot estimate the gas usage when calling the mint function as the uri parameter's length can be arbitrary. Solidity documentation recommends the following:

As a general rule, use bytes for arbitrary-length raw byte data and string for arbitrary-length string (UTF-8) data. If you can limit the length to a certain number of bytes, always use one of the value types bytes1 to bytes32 because they are much cheaper.

