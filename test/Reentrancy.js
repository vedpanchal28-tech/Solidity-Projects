const { expect } = require ('chai')
const { ethers } = require ('hardhat')

describe('Reentrancy', () => {
    let deployer,bank;

    beforeEach(async() => {
    [deployer] = await ethers.getSigners()

        const Bank = await ethers.getContractFactory('Bank', deployer);
        bank = await Bank.deploy();

        await bank.deposit({value: ethers.utils.parseUnits('100')})
        
    })

    describe('faciliates deposits and withdrawns', () => {
        it('accpets deposits', async () => {
            // Check deposite balance
            const deployerbalance = await bank.balanceOf(deployer.address)
            expect (deployerbalance).to.eq(ethers.utils.parseUnits('100'))
        })
    })
})