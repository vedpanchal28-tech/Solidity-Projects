pragma solidity >0.6.0;

//SPDX-License-Identifier: UNLICENSED

contract Counter {
    string public name;
    uint public count;

    constructor (string memory _name,uint _initialcount) {
        name = _name;
        count = _initialcount;
    } 

    function increment() public {
        count++;
    }

    function decrement() public {
        count--;
    }

    function getcount() public view returns(uint _count) {
        return count;
    }

    function setcount(uint _count) public {
        count = _count;
    }

    function getname() public view returns(string memory _name) {
        return name;
    }

    function setName(string memory _name) public {
        name = _name;
    }
}