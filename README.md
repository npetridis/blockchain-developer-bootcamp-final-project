# DefiVault - Defi wallet and funds investor 


<img src="./ui-app/public/defivault.svg" alt="drawing"  />

<p>A smart contract wallet that stores ether and any Erc20 token and can invest in Compound.finance protocol any supported Erc20 token</p>

The contract is deployed and verified(??) on the Ropsten testnet at  
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
* redeem ERC20 tokens supplied to Compound.finance along with interest (for short term supply period we could notice that we redeemed less than we supplied due to the fees)

### UI client
A Next.js app that uses ethers.js wrapped in custom hooks to interact with the blockchain  
The app integrates with all the smart contract functionalities through the three following sections that correspond to the UI tabs:
* Ether: exposes functionality to interact with ether (deposit, withdraw)
* ERC20: exposes functionality to interact with ERC20 tokens (deposit,  withdraw, supply to Compound, redeem from compound)
* PTRD: this is a control panel for a custom deployed ERC20 token that can do all the basic ERC20 token interactions and most importantly transfer tokens to any user and approve tokens towards the DefiVault contract so that we can use its <i>deposit tokens</i> functionality


## How to interact with DefiVault

There are two ways to use DefiVault, both of them require metamask browser plugin to be installed.
### 1. Interact through UI client deployed publicly in Vercel

* Go to <a href='https://defivault.vercel.app/'>https://defivault.vercel.app</a>
* Connect with metamask on Ropsten network
* Get ether from <a href='https://faucet.ropsten.be/'>ropsten faucet</a> to use ether wallet functionality (deposit and withdraw ether)
* Use PTRD control panel to transfer custom deployed ERC20 token to your wallet and interact with ERC20 wallet functionality (depositToken, withdrawToken)
* Exchange ether with other Compound protocol compatible tokens in uniswap in order to deposit them in DefiVault and invest them in Compound (more on this later)

### 2. Setup the project locally
#### Contracts deployment
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
  </ul>

####  Contracts deployment
<ul>
   <li>Create .env file in ui-app and add the required fields</li>

    cd ../ui-app
    touch .env
  Using the `.env.example` file as a guide to fill in the .env with the required fields
  To make it work for local ganache-cli network we need the contract addresses of `DefiVault` and `Petridereum` and the private key of the first ganache-cli address (This account is the owner of Petridereum and can transfer us tokens to test the app)
   
  <li>Install UI client dependencies and start the server locally</li>

    yarn dev
</ul>
Disclaimer: The Compound.finance functionality needs the setup of the Compound contracts locally and is not covered. Please use the deployed Ropsten contracts.

## Smart contract unit tests

To run the unit tests start `ganache-cli` in a terminal and then in a new window run:

    truffle test
or

    npm run test

## Corners cut

* UI is not optimized or smaller screens
* Gas optimization


## Walkthrough
To test the compound.finance integration in Ropsten with COMP token:
* Get ether from <a href='https://faucet.ropsten.be/'>ropsten faucet</a>
* Exchange some ether for COMP in uniswap, add the <a href='https://ropsten.etherscan.io/token/0xf76d4a441e4ba86a923ce32b89aff89dbccaa075'>correct COMP address</a> in <a href='https://app.uniswap.org/#/swap'>uniswap</a>
* Use <a href='https://ropsten.etherscan.io/token/0xf76d4a441e4ba86a923ce32b89aff89dbccaa075#writeContract'>COMP etherscan contract panel</a> to approve COMP to the DefiVault contract
* Deposit comp to defivault using the 2nd tab (the defivault contract address can be found in PTRD tab or in deployed_addresses.txt)
* After deposit is complete get the <a href='https://ropsten.etherscan.io/token/0x70014768996439f71c041179ffddce973a83eef2'>cCOMP contract address</a> from <a href='https://compound.finance/docs#networks'>compound website (ropsten)</a> and supply COMP from `Invest with Compound` tab
* Upon success you should see the minted cCOMP tokens in your wallet
* Use the redeem section to send back the cCOMP and get COMP + interest - fees in your DefiVault wallet

## Ethereum account (for NFT certification)
```
0x0484bd57f856eA52bBd00188947E37c9809276B6
```
