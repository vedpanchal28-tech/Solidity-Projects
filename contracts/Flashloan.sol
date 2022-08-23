// SPDX-License-Identifier: Unlicense

// Contract inspire by Damn Vulnerable Defi

pragma solidity ^0.8.0;

import "./Token.sol";
import "hardhat/console.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IReceiver {
    function receiveTokens(address tokenAddress, uint256 amount) external;
}

contract Flashloan  is ReentrancyGuard{
    using SafeMath for uint;
    Token public token;
    uint256 public poolBalance;

    constructor(address _tokenaddress) {
        token = Token(_tokenaddress);
    }

    function depositTokens(uint256 _amount) external nonReentrant { 
        require(_amount > 0,"Must Deposit at least one token");
        token.transferFrom(msg.sender,address(this),_amount);
        poolBalance = poolBalance.add(_amount);
    }

    function flashloan(uint256 _borrowamount) external nonReentrant {
        require(_borrowamount > 0,"Must Borrow at least one token");

        uint256 balanceBefore = token.balanceOf(address(this));
        require(balanceBefore >= _borrowamount,"Not enough atokens in pool");

        // Ensures by the protocol via the 'depositeTokens' funtion
        assert(poolBalance == balanceBefore);

        // sends tokens to receiver
        token.transfer(msg.sender, _borrowamount);

        //Get paid back
        IReceiver(msg.sender).receiveTokens(address(token),_borrowamount);

        //Ensure loan paid back
        uint256 balanceAfter = token.balanceOf(address(this));
        require(balanceAfter >= balanceBefore,"Flashloan hasnt been paid back");
    } 
}