pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/ownership/Claimable.sol";
import "openzeppelin-solidity/contracts/ownership/HasNoEther.sol";
import "./ownership/HasClaimableContracts.sol";

contract RayonBase is Claimable, HasNoEther, HasClaimableContracts {
    bool internal proxy;
    string internal name;
    uint16 internal version;

    constructor(string _name, uint16 _version) public {
        require(_version >= 0, "version must be greater than or equals zero");
        require(bytes(_name).length > 0, "name cannot be null");
        proxy = false;
        name = _name;
        version = _version;
    }

    function getName() public view returns(string){
        return name;
    }

    function getVersion() public view returns(uint16){
        return version;
    }

    function _addressToBytes(address _a) internal pure returns (bytes b) {
        assembly {
            let m := mload(0x40)
            mstore(add(m, 20), xor(0x140000000000000000000000000000000000000000, _a))
            mstore(0x40, add(m, 52))
            b := m
        }
    }

    function _verifySignature(bytes32 _dataHash, address _signedAddress, uint8 _v, bytes32 _r, bytes32 _s) internal pure returns (bool) {
        return ecrecover(_dataHash, _v, _r, _s) == _signedAddress;
    }

    function isProxy() public view returns(bool){
        return proxy;
    }

    function claimOwnershipContract(address _contractAddr) external onlyOwner {
        require(_contractAddr != address(0), "contract address cannot be 0x0");
        Claimable contractInst = Claimable(_contractAddr);
        contractInst.claimOwnership();
    }

    function reclaimOwnershipContract(address _contractAddr) external onlyOwner {
        require(_contractAddr != address(0), "contract address cannot be 0x0");
        Ownable contractInst = Ownable(_contractAddr);
        contractInst.transferOwnership(owner);
    }

    function kill() external onlyOwner {
        selfdestruct(owner);
    }
}