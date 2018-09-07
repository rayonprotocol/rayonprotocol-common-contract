const RayonBase = artifacts.require('./RayonBase.sol');

require('chai')
    .use(require('chai-as-promised'))
    .should();

var rayonBaseContract;
contract('RayonBase', function (accounts) {
    const admin = accounts[0];

    // before(async function () {
    //     rayonBaseContract = await RayonBase.new(1, { from: admin });
    // })

    describe('name and version checking', function () {
        it('normal contract', async function () {
            const name = "RayonBase";
            const version = 1;
            
            rayonBaseContract = await RayonBase.new(name, version, { from: admin });
            assert.equal(await rayonBaseContract.getName({ from: admin }), name);
            assert.equal(await rayonBaseContract.getVersion({ from: admin }), version);
        })
        it('name is empty', async function () {
            const name = "";
            const version = 1;
            
            rayonBaseContract = await RayonBase.new(name, version, { from: admin }).should.be.rejectedWith(/revert/);
        })
        it('version is 0', async function () {
            const name = "RayonBase";
            const version = 0;

            rayonBaseContract = await RayonBase.new(name, version, { from: admin }).should.be.rejectedWith(/revert/);
        })
    })
})