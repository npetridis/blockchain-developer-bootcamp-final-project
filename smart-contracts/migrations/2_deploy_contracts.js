// const ConvertLib = artifacts.require("ConvertLib");
// const MetaCoin = artifacts.require("MetaCoin");
const Petrideum = artifacts.require("Petrideum");
const DefiVault = artifacts.require("DefiVault");

module.exports = function (deployer) {
  // deployer.deploy(ConvertLib);
  // deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(Petrideum);
  deployer.deploy(DefiVault);
};
