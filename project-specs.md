PASTE_YOUR_FINAL_PROJECT_REPO_HERE

Please answer the following questions. Does your project:

1. Follow this naming format: https://github.com/YOUR_GITHUB_USERNAME_HERE/blockchain-developer-bootcamp-final-project? YES/NO

2. Contain a README.md file which describes the project, describes the directory structure, and where the frontend project can be accessed? YES/NO

3. Contain smart contract(s) which:

- Are commented to the specs described by NatSpec Solidity documentation
  (https://docs.soliditylang.org/en/develop/natspec-format.html)
- Use at least two design patterns from the "Smart Contracts" section
  (Pausable?)
  Could I add a contract called eth wallet (has functionality to withdraw and deposit eth) and the main wallet would inherit it?

  mint erc20 token and distribute it to the wallet users for future governance
  maybe create a function that every year will check the wallet user balances and mint the token

  ownable and pausable by a DAO contract address?

- Protect against two attack vectors from the "Smart Contracts" section with its the SWC number
  (https://swcregistry.io/ SWC-107, )
- Inherits from at least one library or interface
- Can be easily compiled, migrated and tested? YES/NO

4. Contain a Markdown file named design_pattern_decisions.md and avoiding_common_attacks.md? YES/NO

5. Have at least five smart contract unit tests that pass? YES/NO

6. Contain a `deployed_address.txt` file which contains the testnet address and network where your contract(s) have been deployed? YES/NO

7. Have a frontend interface built with a framework like React or HTML/CSS/JS that:
   --Detects the presence of MetaMask
   --Connects to the current account
   --Displays information from your smart contract
   --Allows a user to submit a transaction to update smart contract state
   --Updates the frontend if the transaction is successful or not? YES/NO

8. Hosted on Heroku, Netlify, or some other free frontend service that gives users a public interface to your decentralized application? (That address should be in your README.md document) YES/NO

9. Have a folder named scripts which contains these scripts:
   --`scripts/bootstrap` When run locally, it builds or checks for the dependencies of your project.
   --`scripts/server` Spins up a local testnet and server to serve your decentralized application locally
   --`scripts/tests` Used to run the test suite for your project? YES/NO

10. A screencast of you walking through your project? YES/NO

Congratulations on finishing your final project!
