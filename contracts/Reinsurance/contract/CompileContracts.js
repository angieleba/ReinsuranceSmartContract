const fs = require("fs");
const solc = require('solc')
let Web3 = require('web3');

let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

var input = {'Reinsure.sol': fs.readFileSync('contracts\\Reinsurance\\contract\\Reinsure.sol', 'utf8'),'Permissions.sol': fs.readFileSync('contracts\\Reinsurance\\contract\\Permissions.sol', 'utf8')};
let compiledContract = solc.compile({sources: input}, 1);
let abi = compiledContract.contracts['Reinsure.sol:ReinsuranceContract'].interface;
let bytecode = '0x'+compiledContract.contracts['Reinsure.sol:ReinsuranceContract'].bytecode;

let gasEstimate = web3.eth.estimateGas({data: bytecode});
let LMS = web3.eth.contract(JSON.parse(abi));


var lms = LMS.new("sanchit", "s@a.com", {
   from:web3.eth.coinbase,
   data:bytecode,
   gas: gasEstimate
 }, function(err, myContract){
    if(!err) {
       if(!myContract.address) {
           console.log(myContract.transactionHash) 
       } else {
           console.log(myContract.address) 
       }
    }
  });