const { expect } = require ('chai');
const { ethers } = require ('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe ('RealEstate', () => {

    let realEstate,escrow;
    let seller,buyer,inspector,lender;
    let nftID = 1;
    let Purchaseprice=ether(100),escrowAmount = ether(20);

    beforeEach(async () => {

        // Setup Accounts
        accounts = await ethers.getSigners()
        seller = accounts[0];
        buyer = accounts[1];
        inspector = accounts[2];
        lender = accounts[3];
       
        //Load Contracts
        const RealEstate = await ethers.getContractFactory('RealEstate');
        const Escrow = await ethers.getContractFactory('Escrow')

        //Deploy Contracts
        realEstate = await RealEstate.deploy()
        escrow = await Escrow.deploy(
            realEstate.address,
            nftID,
            Purchaseprice,
            escrowAmount,
            seller.address,
            buyer.address,
            inspector.address,
            lender.address)

        //Seller Approves 
        transaction = await realEstate.connect(seller).approve(escrow.address,nftID)
        await transaction.wait()   
    })

    describe('Deployement',async () => {

        it('Sends an NFT to the seller / deployer', async () => {
            expect(await realEstate.ownerOf(nftID)).to.equal(seller.address)
        })
    })

    describe('Selling real Estate',async () => {

        it('executes a successful transaction', async () => {
            // Expects seller to be NFT owner before the sale
            expect(await realEstate.ownerOf(nftID)).to.equal(seller.address)

            //Check Escrow balance
            balance = await escrow.getBalance()
            console.log("escroe balance: ",ethers.utils.formatEther(balance)) 

            // Buyer deposit earnest
            transaction = await escrow.connect(buyer).depositEarnest({value : escrowAmount})
            await transaction.wait()
            console.log("Buyer Deposits earnest money")

            //Check Escrow balance
            balance = await escrow.getBalance()
            console.log("escrow balance: ",ethers.utils.formatEther(balance))

            // Inspector Update status
            transaction = await escrow.connect(inspector).updateinspectionstatus(true)
            await transaction.wait()
            console.log('Inspector Update status')

            // Buyer Approves sale
            transaction = await escrow.connect(buyer).approvesale()
            await transaction.wait()
            console.log('Buyer approved sale')

            // seller Approves sale
            transaction = await escrow.connect(seller).approvesale()
            await transaction.wait()
            console.log('Seller approved sale')

            // Lender funds to sell
            transaction = await lender.sendTransaction({to : escrow.address, value: ether(80)})

            // lender Approves sale
            transaction = await escrow.connect(lender).approvesale()
            await transaction.wait()
            console.log('lender approved sale')

            // Finalize the sale
            transaction = await escrow.connect(buyer).finalizeSale()
            await transaction.wait()
            console.log('Buyer finalize sale')

            // Expect Buyer to be an owner of nft after sale
            expect(await realEstate.ownerOf(nftID)).to.equal(buyer.address)

            // Expect Seller to receive funds
            balance = await ethers.provider.getBalance(seller.address)
            console.log("Seller Balance: ",ethers.utils.formatEther(balance))
            expect(balance).to.be.above(ether(10099))

        })
    })
})