# Blockchain developer bootcamp final project

## Decentralized User Authentication

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
