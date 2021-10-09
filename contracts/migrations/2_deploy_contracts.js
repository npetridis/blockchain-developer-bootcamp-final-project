// const ConvertLib = artifacts.require("ConvertLib");
// const MetaCoin = artifacts.require("MetaCoin");
const Petridereum = artifacts.require("Petridereum");
const Wallet = artifacts.require("Wallet");

module.exports = function (deployer) {
  // deployer.deploy(ConvertLib);
  // deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(Petridereum);
  deployer.deploy(Wallet);
};
