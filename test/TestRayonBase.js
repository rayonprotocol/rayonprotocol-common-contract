const RayonBase = artifacts.require('./RayonBase.sol');

require('chai')
    .use(require('chai-as-promised'))
    .should();

contract('RayonBase', function (accounts) {
    const admin = accounts[0];
    const newAdmin = accounts[1];
    const guest = accounts[2];

    var rayonBaseContract;
    var ownerContract;
    before(async function () {
        const name = "RayonBase";
        const version = 1;
        rayonBaseContract = await RayonBase.new(name, version, { from: admin });
        console.log('RayonBase is deployed: ' + rayonBaseContract.address);
        assert.equal(await rayonBaseContract.getName({ from: admin }), name);
        assert.equal(await rayonBaseContract.getVersion({ from: admin }), version);

        const contractEvents = rayonBaseContract.allEvents({ _from: 0 }, function (error, result) {
            if (error) assert("error occurs on event emitted");
            console.log("Event emitted: " + result.event + ", previousOwner: " + result.args.previousOwner + ", newOwner: " + result.args.newOwner + ", blockNumber: " + result.blockNumber);
        });
    })

    describe('name and version checking', function () {
        // it('name is empty', async function () {
        //     const name = "";
        //     const version = 1;

        //     const rayonBaseContract2 = await RayonBase.new(name, version, { from: admin }).should.be.rejectedWith(/revert/);
        // })
        // it('version is 0', async function () {
        //     const name = "RayonBase";
        //     const version = 0;

        //     const rayonBaseContract2 = await RayonBase.new(name, version, { from: admin }).should.be.rejectedWith(/revert/);
        // })
    })
    describe('transfer ownership to new admin (EOA)', function () {
        it('check permission by newAdmin', async function () {
            await rayonBaseContract.owner({ from: newAdmin }).should.be.fulfilled;
            await rayonBaseContract.pendingOwner({ from: newAdmin }).should.be.fulfilled;
            await rayonBaseContract.transferOwnership(newAdmin, { from: newAdmin }).should.be.rejectedWith(/revert/);
            await rayonBaseContract.claimOwnership({ from: newAdmin }).should.be.rejectedWith(/revert/);
        })
        it('transfer ownership to newAdmin by admin', async function () {
            // transferOwnership -> to pendingOwner
            await rayonBaseContract.transferOwnership(newAdmin, { from: admin }).should.be.fulfilled;
            assert.equal(await rayonBaseContract.owner({ from: admin }), admin);
            assert.equal(await rayonBaseContract.pendingOwner({ from: admin }), newAdmin);
            await rayonBaseContract.transferOwnership(guest, { from: newAdmin }).should.be.rejectedWith(/revert/);
        })
        it('claim ownership by newAdmin', async function () {
            // claimOwnership
            await rayonBaseContract.claimOwnership({ from: newAdmin }).should.be.fulfilled;
            assert.equal(await rayonBaseContract.owner({ from: newAdmin }), newAdmin);
            assert.equal(await rayonBaseContract.pendingOwner({ from: newAdmin }), 0);
        })
        it('check permission by previous admin', async function () {
            await rayonBaseContract.owner({ from: admin }).should.be.fulfilled;
            await rayonBaseContract.pendingOwner({ from: admin }).should.be.fulfilled;
            await rayonBaseContract.transferOwnership(guest, { from: admin }).should.be.rejectedWith(/revert/);
            await rayonBaseContract.claimOwnership({ from: admin }).should.be.rejectedWith(/revert/);
        })
    })
    describe('transfer ownership to previous admin (EOA)', function () {
        it('check permission by previous admin', async function () {
            await rayonBaseContract.owner({ from: admin }).should.be.fulfilled;
            await rayonBaseContract.pendingOwner({ from: admin }).should.be.fulfilled;
            await rayonBaseContract.transferOwnership(admin, { from: admin }).should.be.rejectedWith(/revert/);
            await rayonBaseContract.claimOwnership({ from: admin }).should.be.rejectedWith(/revert/);
        })
        it('transfer ownership to previous admin by newAdmin', async function () {
            // transferOwnership -> to pendingOwner
            await rayonBaseContract.transferOwnership(admin, { from: newAdmin }).should.be.fulfilled;
            assert.equal(await rayonBaseContract.owner({ from: newAdmin }), newAdmin);
            assert.equal(await rayonBaseContract.pendingOwner({ from: newAdmin }), admin);
            await rayonBaseContract.transferOwnership(guest, { from: admin }).should.be.rejectedWith(/revert/);
        })
        it('claim ownership by previous admin', async function () {
            // claimOwnership
            await rayonBaseContract.claimOwnership({ from: admin }).should.be.fulfilled;
            assert.equal(await rayonBaseContract.owner({ from: admin }), admin);
            assert.equal(await rayonBaseContract.pendingOwner({ from: admin }), 0);
        })
    })
    describe('transfer ownership to ownerContract', function () {
        it('deploy adminContract', async function () {
            const name = "OwnerContact";
            const version = 1;
            ownerContract = await RayonBase.new(name, version, { from: admin });
            console.log('ownerContract is deployed: ' + ownerContract.address);
            assert.equal(await ownerContract.getName({ from: admin }), name);
            assert.equal(await ownerContract.getVersion({ from: admin }), version);
        })
        it('transfer ownership to ownerContract by admin', async function () {
            // transferOwnership -> to pendingOwner
            await rayonBaseContract.transferOwnership(ownerContract.address, { from: admin }).should.be.fulfilled;
            assert.equal(await rayonBaseContract.owner({ from: admin }), admin);
            assert.equal(await rayonBaseContract.pendingOwner({ from: admin }), ownerContract.address);
        })
        it('claim ownership by adminContract', async function () {
            // claimOwnership
            await ownerContract.claimOwnershipContract(rayonBaseContract.address, { from: admin }).should.be.fulfilled;
            assert.equal(await rayonBaseContract.owner({ from: admin }), ownerContract.address);
            assert.equal(await rayonBaseContract.pendingOwner({ from: admin }), 0);
        })
    })
    describe('reclaim ownership to admin (owner of ownerContract)', function () {
        it('recliam ownership to admin', async function () {
            // recliamOwnership -> to pendingOwner
            await ownerContract.reclaimOwnershipContract(rayonBaseContract.address, { from: admin }).should.be.fulfilled;
            assert.equal(await rayonBaseContract.owner({ from: admin }), ownerContract.address);
            assert.equal(await rayonBaseContract.pendingOwner({ from: admin }), admin);
        })
        it('claim ownership by admin', async function () {
            // claimOwnership
            await rayonBaseContract.claimOwnership({ from: admin }).should.be.fulfilled;
            assert.equal(await rayonBaseContract.owner({ from: admin }), admin);
            assert.equal(await rayonBaseContract.pendingOwner({ from: admin }), 0);
        })
    })
})