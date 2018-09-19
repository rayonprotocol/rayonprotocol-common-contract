pragma solidity ^0.4.23;

import "./RayonBase.sol";

contract RayonProxy is RayonBase {
    address private targetAddress;

    // constructor
    constructor(string _name) RayonBase(_name, 0) public {}

    function getTargetAddress() external returns (address) {
        return targetAddress;
    }
    function setTargetAddress(address _address) external {
        require(_address != address(0), "contract address cannot be 0x0");
        RayonBase targetContract = RayonBase(_address);
        require(keccak256(targetContract.getName()) == keccak256(name), "contract\'s name must be equals");
        require(targetContract.getVersion() > version, "target contract\'s version must be greater than current");

        targetAddress = _address;
        version = targetContract.getVersion();
    }

    function () external {
        address contractAddr = targetAddress;
        assembly {
            let ptr := mload(0x40)
            calldatacopy(ptr, 0, calldatasize)
            let result := delegatecall(gas, contractAddr, ptr, calldatasize, 0, 0)
            let size := returndatasize
            returndatacopy(ptr, 0, size)

            switch result
            case 0 { revert(ptr, size) }
            default { return(ptr, size) }
        }
    }
}
