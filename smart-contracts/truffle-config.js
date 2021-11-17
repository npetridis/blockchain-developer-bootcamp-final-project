const HDWalletProvider = require('@truffle/hdwallet-provider')

const PRIVATE_KEYS = {
  ropsten: '5a21febe1c40389510aed9e3b627b34b5dd0ac603bbc56bfce437d23a5b76806'
}

const INFURA_URLS = {
  ropsten: 'https://ropsten.infura.io/v3/15c2e8fee7c04556986494cb86fc4d2d'
}

module.exports = {
  // Uncommenting the defaults below 
  // provides for an easier quick-start with Ganache.
  // You can also follow this format for other networks;
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  //
  compilers: {
    solc: {
      version: '0.8.9'
    }
  },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    test: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider({
          privateKeys: [PRIVATE_KEYS.ropsten],
          providerOrUrl: INFURA_URLS.ropsten,
          numberOfAddresses: 1
        })
      },
      network_id: 3,
      gas: 4000000      //make sure this gas allocation isn't over 4M, which is the max
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(MNEMONIC, "https://ropsten.infura.io/YOUR_API_KEY")
      },
      network_id: 4,
      gas: 4000000      //make sure this gas allocation isn't over 4M, which is the max
    }
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
