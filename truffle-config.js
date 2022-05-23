const HDWalletProvider = require("@truffle/hdwallet-provider");
const fs = require("fs");

const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    dashboard: {},
    matic: {
      provider: () =>
        new HDWalletProvider(
          process.env.ADMIN_PRIVATE_KEY,
          process.env.POLYGON_URL
        ),
      network_id: 80001,
      chainId: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    inf_infura_test_rinkeby: {
      network_id: 4,
      gas: 3000000,
      gasPrice: 10000000000,
      provider: new HDWalletProvider(
        process.env.ADMIN_PRIVATE_KEY,
        process.env.RINKEBY_URL
      ),
      skipDryRun: true,
    },
  },

  compilers: {
    solc: {
      version: "0.8.4",
    },
  },
  db: {
    enabled: false,
    host: "127.0.0.1",
  },
};
