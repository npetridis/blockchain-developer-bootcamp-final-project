const HDWalletProvider = require('@truffle/hdwallet-provider')
require('dotenv').config();

module.exports = {
  compilers: {
    solc: {
      version: '0.8.9'
    }
  },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545, // ganache-cli
      network_id: "*"
    },
    test: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider({
          privateKeys: [process.env.DEPLOYER_PRIVATE_KEY],
          providerOrUrl: process.env.ROPSTEN_RPC_URL,
          numberOfAddresses: 1
        })
      },
      network_id: 3,
      gas: 4000000
    },
  },
};
