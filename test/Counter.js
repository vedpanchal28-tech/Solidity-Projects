const { expect } = require('chai');
const { ethers } = require ('hardhat');

let counter

beforeEach(async () => {
    const Counter = await ethers.getContractFactory('Counter')
    counter = await Counter.deploy('My Counter',1)
})


describe('Counter', () => {
    
   
    it('stores the count', async () => {         
        expect(await counter.count()).to.equal(1)
    })

    it('sets the initial name', async () => {
        expect(await counter.name()).to.equal('My Counter')
    })
    
})

describe('Counting', () =>{

    let transaction

    it('reads count from the "count" public variable',async () => {
        expect(await counter.count()).to.equal(1)
    })

    it('reads the count from "get count" function',async () => {
        expect(await counter.getcount()).to.equal(1)
    })

   
    it('increments the count',async () => {
        transaction = await counter.increment()
        await transaction.wait()

        expect(await counter.count()).to.equal(2)

        transaction = await counter.increment()
        await transaction.wait()

        expect(await counter.count()).to.equal(3)
    })

    it('decremetns the count',async () => {
        transaction = await counter.decrement()
        await transaction.wait()

        expect(await counter.count()).to.equal(0)

        // Cannot decremetn count below 0
        await expect (counter.decrement()).to.be.reverted
    })

    it('reads name from the "Name" public variable',async () => {
        expect(await counter.name()).to.equal('My Counter')
    })

    it('reads the name from "getname" function',async () => {
        expect(await counter.getname()).to.equal('My Counter')
    })

    it('Updates the name',async () => {
        transaction = await counter.setName('New Name')
        await transaction.wait()
        expect(await counter.name()).to.equal('New Name')
    })

})