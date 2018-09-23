require('dotenv').config();

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

// get envs/
const mnemonic = process.env.ACC_MNEMONIC;
const infuraUrl = process.env.INFURA_URL;

// create provides/
const provider = new HDWalletProvider(mnemonic, infuraUrl);

// init web3/
const web3 = new Web3(provider);

// deploy/
const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log('attempting to deploy with account: ', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: ['hi There!!']})
    .send({ from: accounts[0], gas: '1000000'});

  console.log('deployed to: ', result.options.address);
};

// do it.
deploy();