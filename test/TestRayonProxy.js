const RayonBase = artifacts.require('./RayonBase.sol');
const RayonProxy = artifacts.require('./RayonProxy.sol');

require('chai')
    .use(require('chai-as-promised'))
    .should();

contract('RayonProxy', function (accounts) {
    const admin = accounts[0];

    const name = "RayonBase";
    var proxy;
    var logicInteface;
    var logicContract;
    before(async function () {
        proxy = await RayonProxy.new(name, { from: admin });
        logicInteface = await RayonBase.at(proxy.address, { from: admin });
        console.log('RayonProxy is deployed: ' + logicInteface.address);
        assert.equal(await logicInteface.getName({ from: admin }), name);
        assert.equal(await logicInteface.getVersion({ from: admin }), 0);
    })

    describe('first target contract is deployed and set', function () {
        const version = 1;
        it('deploy target contract', async function () {
            logicContract = await RayonBase.new(name, version, { from: admin });
            console.log('LogicContrace is deployed: ' + logicContract.address);

            assert.equal(await logicContract.getName({ from: admin }), name);
            assert.equal(await logicContract.getVersion({ from: admin }), version);
        })
        it('set target contract', async function () {
            proxy.setTargetAddress(logicContract.address).should.be.fulfilled;
            assert.equal(await logicInteface.getName({ from: admin }), name);
            console.log('Set RayonProxy\'s target contract to : ' + logicContract.address + ', interface : ' + logicInteface.address);

            assert.equal(await logicInteface.getName({ from: admin }), name);
            assert.equal(await logicInteface.getVersion({ from: admin }), version);
        })
    })
    describe('second target contract is deployed and set', function () {
        const version = 10;
        it('deploy target contract', async function () {
            logicContract = await RayonBase.new(name, version, { from: admin });
            console.log('LogicContrace is deployed: ' + logicContract.address);

            assert.equal(await logicContract.getName({ from: admin }), name);
            assert.equal(await logicContract.getVersion({ from: admin }), version);
        })
        it('set target contract', async function () {
            proxy.setTargetAddress(logicContract.address).should.be.fulfilled;
            assert.equal(await logicInteface.getName({ from: admin }), name);
            console.log('Set RayonProxy\'s target contract to : ' + logicContract.address + ', interface : ' + logicInteface.address);

            assert.equal(await logicInteface.getName({ from: admin }), name);
            assert.equal(await logicInteface.getVersion({ from: admin }), version);
        })
    })
    describe('wrong target contract is deployed and set', function () {
        it('same target version', async function () {
            const currentTargetVersion = await logicInteface.getVersion({ from: admin });
            const version = currentTargetVersion;
            logicContract = await RayonBase.new(name, version, { from: admin });
            proxy.setTargetAddress(logicContract.address).should.be.rejectedWith(/revert/);
        })
        it('small target version', async function () {
            const currentTargetVersion = await logicInteface.getVersion({ from: admin });
            const version = currentTargetVersion - 1;
            logicContract = await RayonBase.new(name, version, { from: admin });
            proxy.setTargetAddress(logicContract.address).should.be.rejectedWith(/revert/);
        })
    })
})