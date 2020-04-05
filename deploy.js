Web3 = require('web3')
debug = require('debug')('app');
fs = require('fs');
solc = require('solc');
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
console.log("Reading contract files...");
code = {'Reinsure.sol': fs.readFileSync('contract\\Reinsure.sol', 'utf8'),'Strings.sol' : fs.readFileSync('libraries\\Strings.sol', 'utf8')};
console.log("Compiling code...");
compiledContract = solc.compile({sources: code}, 1);
console.log("Deploying of contract is in progress...");
abiDefinition = JSON.parse(compiledContract.contracts['Reinsure.sol:ReinsuranceContract'].interface);
Contract = web3.eth.contract(abiDefinition)
bytecode = '0x'+compiledContract.contracts['Reinsure.sol:ReinsuranceContract'].bytecode;
deployedContract = Contract.new(
['0x37F1C9a322De17A358Bb42Bb4ff09d542140D331', '0x812B59988fe328607ceb6096b94aCd85e276Ef5e', '0xf9a062E86d8d91Fa9E4364A9BF2247e8145B5f88'], 
['Clause 1', 'Clause 2'], {data: bytecode, from: web3.eth.accounts[0], gas: 6000000}, function (err, deployedContract) {
    if (deployedContract.address) {
        console.log(`Address: ${deployedContract.address}`);
		interf = compiledContract.contracts['Reinsure.sol:ReinsuranceContract'].interface;
		console.log(interf);
		console.log("Contract was successfully deployed!");
		contractInstance = Contract.at(deployedContract.address);
		contractInstance.RequestReinsuranceTransaction.sendTransaction('0xFCbCE7A50632C08470C7c7A68bf7428A58E1115F','0xc3FE59648c5b48324C806E98e0c1B4408768363F', 0, 13, {from: web3.eth.accounts[0], gas: 300000})
    }
});

