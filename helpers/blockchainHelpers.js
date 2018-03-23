const Web3 = require('web3');
const solc = require('solc');

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

const createContract = function(options) {
  try {
    const solidityContract = fs.readFileSync('../contracts/Voting.sol').toString();
    const compiledContract = solc.compile(solidityContract);
    const abi = JSON.parse(compiledContract.contracts[':Voting'].interface);
    const votingContract = web3.eth.contract(abi);
    const byteCode = '0x' + compiledContract.contracts[':Voting'].bytecode;
    web3.personal.unlockAccount(web3.eth.accounts[0], 'raven');
    const deployedContract = votingContract.new(options, { data: byteCode, from: web3.eth.accounts[0], gas: 470000});
    return deployedContract;
  }
  catch (err) {
    console.log('Failed to create contract!');
    console.log(err);
  }
}

const retrieveContract = function(address) {
  try {
    const solidityContract = fs.readFileSync('../contracts/Voting.sol').toString();
    const compiledContract = solc.compile(solidityContract);
    const abi = JSON.parse(compiledContract.contracts[':Voting'].interface);
    const votingContract = web3.eth.contract(abi);
    return votingContract.at(address);
  }
  catch (err) {
    console.log('Failed to retrieve contract!');
    console.log(err);
  }
}

exports.createContract = createContract;
exports.retrieveContract = retrieveContract;