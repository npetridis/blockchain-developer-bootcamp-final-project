const EtherWallet = artifacts.require('EtherWallet');
const { expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const Chance = require('chance');

contract('EtherWallet', (accounts) => {
  let instance;
  let account;

  beforeEach(async () => {
    instance = await EtherWallet.new();

    const chance = new Chance();
    account = chance.pickone(accounts);
  });

  it('should have zero ether balance', async () => {
    const ethBalance = await instance.getEtherBalance({ from: account });

    assert.equal(ethBalance, 0, 'user should own zero ether in the wallet');
  });

  it('deposits ether', async () => {
    const tx = await instance.depositEther({ from: account, value: 1000 });
    expectEvent(tx, 'DepositEther', { sender: account, amount: '1000', balance: '1000' });

    const ethBalance = await instance.getEtherBalance({ from: account });
    assert.equal(ethBalance, 1000, 'user should have 10 ether balance in the wallet');
  });

  it('withdaws ether', async () => {
    await instance.depositEther({ from: account, value: 10 });

    const tx = await instance.withdrawEther(7, { from: account });
    expectEvent(tx, 'WithdrawEther', { to: account, amount: '7', balance: '3' });

    const ethBalance = await instance.getEtherBalance({ from: account });
    assert.equal(ethBalance, 3, 'user should have 3 ether balance in the wallet');
  });

  it('reverts when trying to withdraw with not enough balance', async () => {
    await expectRevert.unspecified(instance.withdrawEther(7, { from: account }));
  });
});
