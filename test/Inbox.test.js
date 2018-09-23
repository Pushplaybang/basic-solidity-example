const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const { interface, bytecode } = require('../compile.js');

const provider =  ganache.provider();
const web3 = new Web3(provider);

let accounts;
let inbox;

beforeEach(async () => {
  // get a list of unlocked accounts for testing
  accounts = await web3.eth.getAccounts();

  // use one account to deploy the contrac
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: [
        'Hi There',
      ],
    }).send({
      from: accounts[0],
      gas: '1000000',
    });

  inbox.setProvider(provider);
});

describe('Inbox', () => {
  it('deploys the contract', () => assert.ok(inbox.options.address));
  it('has a default message', async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, 'Hi There');
  });
  it('can change the message with setMessage', async () => {
    await inbox.methods.setMessage('message value updated!').send({
      from: accounts[0],
    });
    const message = await inbox.methods.message().call();
    assert.equal(message, 'message value updated!');
  });
});

