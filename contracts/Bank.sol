// SPDX-License-Identifier: UNLICENSE

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";

contract Bank {
    using Address for address payable;

    mapping(address => uint256) public balanceOf;
    // Deposit ether funds
    function deposit() external payable {
        balanceOf[msg.sender] += msg.value;
        
    }
    // withdraw ether funds

}