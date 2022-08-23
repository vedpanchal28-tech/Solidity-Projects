const { expect } = require ('chai');
const { ethers } = require ('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe ('Flashloan',async() => {
    let token,flashloan,transaction,flashloanReceiver;

    beforeEach(async() => {
        //Setup accounts
        accounts = await ethers.getSigners()
        deployer = accounts[0]

        //Load contract
        const Flashloan = await ethers.getContractFactory('Flashloan')
        const FlashloanReceiver = await ethers.getContractFactory('FlashloanReceiver')
        const Token = await ethers.getContractFactory('Token')

        // Deploy Token
        token = await Token.deploy('Ved Panchal','Ved','1000000')
        
        //Deploy flashloanpool
        flashloan = await Flashloan.deploy(token.address)

        //Approve token before depositing
        transaction = await token.connect(deployer).approve(flashloan.address,tokens(1000000))
        await transaction.wait()

        //Deposit tokn to pool
        transaction = await flashloan.connect(deployer).depositTokens(ether(1000000))
        await transaction.wait()

        //Deploy FlashLoan receiver
        flashloanReceiver = await FlashloanReceiver.deploy(flashloan.address)
    })

    describe('Deployement',async() => {

         it('Sends to the flashloan contract',async() => {
            expect(await token.balanceOf(flashloan.address)).to.equal(tokens(1000000))
         })
     })

     describe('Borrowing funds',() => {
        it('borrow funds from the pool',async() => {
            let amount = ether(100)
            let transaction = await flashloanReceiver.connect(deployer).executeFlashloan(amount)
            await transaction.wait()

            await expect(transaction).to.emit(flashloanReceiver,'LoanReceived')
            .withArgs(token.address, amount)
        })
        })
     })
 