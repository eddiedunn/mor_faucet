

const { expect } = require('chai');
const { ethers } = require('hardhat');
const { time } = require("@nomicfoundation/hardhat-network-helpers");

const day = 86400

const dailyDrip = 10

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe('Faucet', () => {
  let token, faucet, accounts, deployer, receiver, exchange

  beforeEach(async () => {
    const Token = await ethers.getContractFactory('MorpheusToken')
    token = await Token.deploy()

    const Faucet = await hre.ethers.getContractFactory("Faucet");
    faucet = await Faucet.deploy(token.address);

    accounts = await ethers.getSigners()
    deployer = accounts[0]
    receiver = accounts[1]
    exchange = accounts[2]

  })


  describe('Populating Tokens', () => {
    beforeEach(async () => {
      populateAmount = tokens(1000)
      transaction = await token.transfer(faucet.address, populateAmount);
      result = await transaction.wait()
    })

    it('token has correct populated amount', async () => {
      const faucetBalance = await token.balanceOf(faucet.address);
      expect(faucetBalance.toString()).to.equal(populateAmount.toString());
    })
  })


  describe('Recieving Tokens', () => {

    describe('Success', () => {

      beforeEach(async () => {
        populateAmount = tokens(1000)
        transaction = await token.transfer(faucet.address, populateAmount);
        result = await transaction.wait()
        dripAmount = tokens(dailyDrip)
        transaction = await faucet.connect(receiver).requestTokens()
        result = await transaction.wait()
      })
    
      it('gives tokens to requestor', async () => {
        expect(await token.balanceOf(receiver.address)).to.equal(dripAmount)
      })
      
    })
    describe('Low balance Failure', () => {

      beforeEach(async () => {
        dripAmount = tokens(1)
      })
    
      it('rejects drip if no tokens', async () => {
        await expect(faucet.connect(receiver).requestTokens()).to.be.reverted
      })
      
    })
    describe('Too soon Failure', () => {

      beforeEach(async () => {
        populateAmount = tokens(1000)
        transaction = await token.transfer(faucet.address, populateAmount);
        result = await transaction.wait()
        dripAmount = tokens(dailyDrip)
        transaction = await faucet.connect(receiver).requestTokens()
        result = await transaction.wait()
      })
    
      it('rejects drip if too soon', async () => {
        await expect(faucet.connect(receiver).requestTokens()).to.be.reverted
      })
      
    })
    describe('Subsequant call success', () => {

      beforeEach(async () => {
        populateAmount = tokens(1000)
        transaction = await token.transfer(faucet.address, populateAmount);
        result = await transaction.wait()
        doubleDripAmount = tokens(2*dailyDrip) // 2 times drip
        transaction = await faucet.connect(receiver).requestTokens()
        result = await transaction.wait()
        await time.increase(3600*25); // 25 hours in seconds
        transaction = await faucet.connect(receiver).requestTokens()
        result = await transaction.wait()
      })
    
      it('gives tokens to requestor second time', async () => {
        expect(await token.balanceOf(receiver.address)).to.equal(doubleDripAmount)
      })
      
    })
  })

})
