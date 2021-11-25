const DefiVault = artifacts.require('DefiVault');
const Petrideum = artifacts.require('Petrideum');
const { expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const Chance = require('chance');

const toBN = web3.utils.toBN;

contract('DefiVault', (accounts) => {
  const [ptrdOwner, alice] = accounts;

  describe('Handles ether', () => {
    let account
    let ptrdInstance
    let defiVaultInstance
    
    beforeEach(async () => {
      ptrdInstance = await Petrideum.new();
      defiVaultInstance = await DefiVault.new();

      const chance = new Chance();
      account = chance.pickone(accounts);
    });

    it('should have no balance', async () => {
      const ethBalance = await defiVaultInstance.getEtherBalance({ from: account });
      assert.equal(ethBalance, 0, 'user should own zero ether in the wallet');
    });

    it('deposits ether', async () => {
      const tx = await defiVaultInstance.depositEther({ from: account, value: 1000 });
      expectEvent(tx, 'DepositEther', { sender: account, amount: '1000', balance: '1000' });
  
      const ethBalance = await defiVaultInstance.getEtherBalance({ from: account });
      assert.equal(ethBalance, 1000, 'user should have 10 ether balance in the wallet');
    });

    it('withdaws ether', async () => {
      await defiVaultInstance.depositEther({ from: account, value: 10 });

      const tx = await defiVaultInstance.withdrawEther(7, { from: account });
      expectEvent(tx, 'WithdrawEther', { to: account, amount: '7', balance: '3' });

      const ethBalance = await defiVaultInstance.getEtherBalance({ from: account });
      assert.equal(ethBalance, 3, 'user should have 3 ether balance in the wallet');
    });
  });

  describe('Handles Erc20 tokens', () => {
    let ptrdInstance
    let defiVaultInstance
    
    beforeEach(async () => {
      ptrdInstance = await Petrideum.new();
      defiVaultInstance = await DefiVault.new();
    });

    it('should have no ptrd token balance', async () => {
      const ptrdBalance = await defiVaultInstance.getTokenBalance(ptrdInstance.address, { from: alice });
      assert.equal(ptrdBalance, 0, 'user should own zero ether in the wallet');
    });

    it('should have no tokens balance', async () => {
      const { tokens, balances } = await defiVaultInstance.getTokens({ from: alice });
      assert.equal(tokens.length, 0, 'user should have no token registered');
      assert.equal(balances.length, 0, 'user should no token balance');
    });

    it('deposits Erc20 token', async () => {
      await ptrdInstance.approve(defiVaultInstance.address, 1000);
      const tx = await defiVaultInstance.depositToken(ptrdInstance.address, 900);
      expectEvent(tx, 'DepositERC20', { 
        sender: ptrdOwner,
        amount: '900',
        erc20Contract: ptrdInstance.address,
        newTotalBalance: '900' 
      });

      assert.equal(
        await ptrdInstance.allowance(ptrdOwner, defiVaultInstance.address),
        100,
        'leftover allowance after deposit is incorrect'
      );

      const ptrdBalance = await defiVaultInstance.getTokenBalance(ptrdInstance.address);
      assert.equal(ptrdBalance, 900);
    });

    it('reverts when trying to deposit with not enough allowance', async () => {
      await expectRevert.unspecified(defiVaultInstance.depositToken(ptrdInstance.address, 900));
    });

    it('withdraws Erc20 token', async () => {
      await ptrdInstance.approve(defiVaultInstance.address, 5000);
      await defiVaultInstance.depositToken(ptrdInstance.address, 5000);

      const ptrdBalance = await defiVaultInstance.getTokenBalance(ptrdInstance.address);
      assert.equal(ptrdBalance.toString(), toBN(5000).toString());

      const tx = await defiVaultInstance.withdrawToken(ptrdInstance.address, 2000);
      expectEvent(tx, 'WithdrawERC20', { 
        to: ptrdOwner,
        amount: '2000',
        erc20Contract: ptrdInstance.address,
        newTotalBalance: '3000' 
      });

      const newPtrdBalance = await defiVaultInstance.getTokenBalance(ptrdInstance.address);
      assert.equal(newPtrdBalance, 3000);
    });

    it('reverts when trying to withdraw with not enough balance', async () => {
      await expectRevert.unspecified(defiVaultInstance.withdrawToken(ptrdInstance.address, 2000));
    });
  });
});
