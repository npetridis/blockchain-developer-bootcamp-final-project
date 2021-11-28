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
          privateKeys: process.env.DEPLOYER_PRIVATE_KEY,
          providerOrUrl: process.env.ROPSTEN_RPC_URL,
          numberOfAddresses: 1
        })
      },
      network_id: 3,
      gas: 4000000
    },
    // rinkeby: {
    //   provider: function() { 
    //    return new HDWalletProvider({
    //     privateKeys: [PRIVATE_KEYS.rinkeby],
    //     providerOrUrl: INFURA_URLS.rinkeby,
    //     numberOfAddresses: 1
    //    })
    //   },
    //   network_id: 4,
    //   gas: 4000000, //4500000,
      // gasPrice: 10000000000,
    // }
  },
  //
  // Truffle DB is currently disabled by default; to enable it, change enabled:
  // false to enabled: true. The default storage location can also be
  // overridden by specifying the adapter settings, as shown in the commented code below.
  //
  // NOTE: It is not possible to migrate your contracts to truffle DB and you should
  // make a backup of your artifacts to a safe location before enabling this feature.
  //
  // After you backed up your artifacts you can utilize db by running migrate as follows: 
  // $ truffle migrate --reset --compile-all
  //
  // db: {
  // enabled: false,
  // host: "127.0.0.1",
  // adapter: {
  //   name: "sqlite",
  //   settings: {
  //     directory: ".db"
  //   }
  // }
  // }
};
