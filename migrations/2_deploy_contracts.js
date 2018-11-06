const RayonProxy = artifacts.require('./RayonProxy.sol');

module.exports = function(deployer, network, accounts) {
  return deployer
    .then(() => {
      return deployer.deploy(RayonProxy, 'ContractName');
    })
    .catch(error => console.error({ error }));
};
