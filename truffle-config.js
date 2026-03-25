module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,   // 👈 must match ganache
      network_id: "*",
      gas: 8000000
    },
  },

  compilers: {
    solc: {
      version: "0.8.20",
    },
  },
};