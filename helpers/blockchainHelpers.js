const Web3 = require('web3');
const solc = require('solc');
const fs = require('fs');

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

const createContract = (options, cb) => {
  try {
    const solidityContract = fs.readFileSync(__dirname + '/../contracts/Voting.sol').toString();
    const compiledContract = solc.compile(solidityContract);
    const abi = JSON.parse(compiledContract.contracts[':Voting'].interface);
    const votingContract = web3.eth.contract(abi);
    const byteCode = `0x${compiledContract.contracts[':Voting'].bytecode}`;
    web3.personal.unlockAccount(process.env.BC_ACCOUNT, process.env.BC_PASSWORD);
    votingContract.new(options, {
      data: byteCode,
      from: process.env.BC_ACCOUNT,
      gas: 470000 
    }, (err, contract) => {
      if (!err) {
        if (!contract.address) {
          console.log(contract.transactionHash);
        } else {
          console.log(contract.address);
          cb(contract);
        }
      } else {
        console.log(err);
      }
    });
  } catch (err) {
    console.log('Failed to create contract!');
    console.log(err);
  }
};

const retrieveContract = (address) => {
  try {
    const solidityContract = fs.readFileSync(__dirname + '/../contracts/Voting.sol').toString();
    const compiledContract = solc.compile(solidityContract);
    const abi = JSON.parse(compiledContract.contracts[':Voting'].interface);
    const votingContract = web3.eth.contract(abi);
    return votingContract.at(address);
  } catch (err) {
    console.log('Failed to retrieve contract!');
    console.log(err);
  }
};

const castVote = (candidate, address) => {
  return new Promise((resolve, reject) => {
    const contract = retrieveContract(address);
    web3.personal.unlockAccount(process.env.BC_ACCOUNT, process.env.BC_PASSWORD);
    contract.voteForCandidate(candidate, { from: process.env.BC_ACCOUNT, gas: 2800000 }, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    })
  });
};

exports.createContract = createContract;
exports.retrieveContract = retrieveContract;
exports.castVote = castVote;