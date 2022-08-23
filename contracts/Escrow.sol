// SPDX-License-Identifier:GPL-3.0

pragma solidity ^0.8.9;

interface IERC721 {
    function transferFrom(address _from,
    address _to,
    uint256 _id) external;
}

contract Escrow {
    // Transfer ownership of property
    address public nftAddress;
    uint256 public nftID;
    uint256 public Purchaseprice;
    uint256 public escrowAmount;
    address payable seller;
    address payable buyer;
    address public inspector;
    address public lender;

    
    modifier onlyBuyer() {
        require(msg.sender == buyer,"Only Byer can call this function");
        _;
    }

    modifier onlyInspector() {
        require(msg.sender == inspector,"Only Inspector can call this function");
        _;
    }

    bool public inspectionpass = false;

    mapping(address => bool) public approval;

    receive() external payable {

    }

    constructor(
    address _nftAddress,
    uint256 _nftID,
    uint256 _Purchaseprice,
    uint256 _escrowAmount,
    address payable _seller,
    address payable _buyer,
    address _inspector,
    address _lender) {
        nftAddress = _nftAddress;
        nftID = _nftID;
        Purchaseprice = _Purchaseprice;
        escrowAmount = _escrowAmount;
        seller = _seller;
        buyer = _buyer;
        inspector = _inspector;
        lender = _lender;
    }

    function depositEarnest() public payable onlyBuyer{
        require(msg.value>=escrowAmount,"Amount is not satisfied");
    }

    function updateinspectionstatus(bool _passed) public onlyInspector {
        inspectionpass = _passed;
    } 

    function approvesale() public {
        approval[msg.sender] = true;
    }

    function getBalance() public view returns(uint) {
        return address(this).balance;
    }

    function cancelsale() public {
        if(inspectionpass = false) {
            payable(buyer).transfer(address(this).balance);
        }
        else {
            payable(seller).transfer(address(this).balance);
        }
    }

    function finalizeSale() public {
        //Transfer ownership of property
        require(inspectionpass,'Must pass inspection');
        require(approval[buyer],'must be approve by buyer');
        require(approval[seller],'must be approve by seller');
        require(approval[lender],'must be approve by lender');
        require(address(this).balance >= Purchaseprice,'Must have enough ether for sale');
        
        (bool success,) = payable(seller).call{value: address(this).balance}("");
        require(success);
        IERC721(nftAddress).transferFrom(seller,buyer,nftID);
    }
}