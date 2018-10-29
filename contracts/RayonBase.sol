pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/ownership/Claimable.sol";
import "openzeppelin-solidity/contracts/ownership/HasNoContracts.sol";
import "openzeppelin-solidity/contracts/ownership/HasNoEther.sol";

contract RayonBase is Claimable, HasNoContracts, HasNoEther {
    string private name;
    uint16 private version;

    constructor(string _name, uint16 _version) public {
        require(_version > 0, "version must be greater than zero");
        require(bytes(_name).length > 0, "name cannot be null");
        name = _name;
        version = _version;
    }

    function getName() public view returns(string){
        return name;
    }

    function getVersion() public view returns(uint16){
        return version;
    }

    function _addressToBytes(address a) internal view returns (bytes b) {
        assembly {
            let m := mload(0x40)
            mstore(add(m, 20), xor(0x140000000000000000000000000000000000000000, a))
            mstore(0x40, add(m, 52))
            b := m
        }
    }

    function _verifySignature(bytes32 dataHash, address _signedAddress, uint8 _v, bytes32 _r, bytes32 _s) internal view returns (bool) {
        return ecrecover(dataHash, _v, _r, _s) == _signedAddress;
    }

    function claimOwnershipContract(address _contractAddr) public onlyOwner {
        require(_contractAddr != address(0), "contract address cannot be 0x0");
        Claimable contractInst = Claimable(_contractAddr);
        contractInst.claimOwnership();
    }

    function reclaimOwnershipContract(address _contractAddr) public onlyOwner {
        require(_contractAddr != address(0), "contract address cannot be 0x0");
        Ownable _contractInst = Ownable(_contractAddr);
        _contractInst.transferOwnership(owner);
    }

    function kill() external onlyOwner {
        selfdestruct(owner);
    }
}