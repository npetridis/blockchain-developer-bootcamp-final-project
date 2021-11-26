# DefiVault - Defi wallet and funds investor 


<img src="./ui-app/public/defivault.svg" alt="drawing"  />

<p>A smart contract wallet that stores ether and any Erc20 token and can invest in Compound.finance protocol any supported Erc20 token</p>

The contract is deployed and verified on the Ropsten testnet at  
`TODO add address`

### Smart contracts
The Smart contracts implement functionality to 
* deposit ether in the DefiVault smart contract
* get the ether balance
* withdraw ether
* deposit any ERC20 token in the DefiVault smart contract
* get all the balances of the deposited ERC20 tokens
* withdraw ERC20 tokens
* supply compatible ERC20 tokens to Compound.finance in order to acquire interest
* redeem ERC20 tokens supplied to Compound.finance along with interest (for short term we could notice that we redeemed less than we supplied due to the fees)

### UI client
A Next.js app that uses ethers.js wrapped in custom hooks to interact with the blockchain
The app has three basic sections (tabs)
* Ether: exposes functionality to interact with ether (deposit, withdraw)
* ERC20: exposes functionality to interact with ERC20 tokens (deposit,  withdraw, supply to Compound, redeem from compound)
* PTRD: this is a control panel for a custom deployed ERC20 token that can do all the basic ERC20 token interactions and most importantly transfer tokens to any user and approve tokens towards the DefiVault contract so that we can use its deposit tokens functionality


## How to interact with DefiVault

There are two ways to use DefiVault, both of them require metamask browser plugin to be installed.
### 1. Interact through UI client deployed publicly in Vercel

* Go to <a href='https://defivault.vercel.app/'>https://defivault.vercel.app</a>
* Connect with metamask on Ropsten network
* Get ether from <a href='https://faucet.ropsten.be/'>ropsten faucet</a> to use ether wallet functionality (deposit and withdraw ether)
* Use PTRD control panel to transfer custom deployed ERC20 token to your wallet and interact with ERC20 wallet functionality (depositToken, withdrawToken)

### 2. Setup the project locally
<ul>
  <li>Clone locally this repository and open a terminal in the top level directory</li>
  <li>Install truffle and ganache-cli</li>

    npm install -g truffle
    npm install -g ganache-cli
   <li>Open a new terminal window and run</li>

     ganache-cli
   <li>Install smart contract dependencies and deploy contracts to local ganache-cli</li>

      npm install
      npm run deploy
   <li>Create .env file in ui-app and add the required fields</li>

    cd ../ui-app
    touch .env
  Using the `.env.example` file as a guide to fill in the .env with the required fields
  To make it work for local ganache-cli network we need the contract addresses of `DefiVault` and `Petridereum` and the private key of the first ganache-cli address (This account is the owner of Petridereum and can transfer us tokens to test the app)
   
  <li>Install UI client dependencies and start the server locally</li>

    yarn dev
</ul>


## Smart contract unit tests

To run the unit tests start `ganache-cli` in a terminal and then in a new window run:

    truffle test
or

    npm run test


## Ethereum account (for NFT certification)
```
TODO: add address
```

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

