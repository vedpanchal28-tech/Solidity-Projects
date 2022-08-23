// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";
import "./Flashloan.sol";

contract FlashloanReceiver {
    Flashloan private pool;
    address private owner;

    event LoanReceived(address token,uint256 amount);

    constructor(address _pooladdress) {
        pool = Flashloan(_pooladdress);
        owner = msg.sender;
    }

    function receiveTokens(address _tokenaddress, uint256 _amount) external {
        require(msg.sender == address(pool),"sender must be pool");
        
        // Require funds receive
        require(Token(_tokenaddress).balanceOf(address(this)) == _amount,'Fail to get loan');

        // Emit event
        emit LoanReceived(_tokenaddress,_amount);
        
        // Do stuff with the money...abi

        // return funds to pool
        require(Token(_tokenaddress).transfer(msg.sender,_amount),"transfer of token failed");
    }

    function executeFlashloan(uint _amount) external {
        require(msg.sender == owner,"only owner can execute this function");
        pool.flashloan(_amount);
    }
}