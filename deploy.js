console.log("Deploying of contract for solidity 0.4.25");

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
deployedContract = Contract.new(['0x0476D588631b6bAb2e35cDAC8550818672314De5', '0x0cA8B34827fDF917c285C76d18746792c3Eeb63a', 
'0x9257470aE10c3d46a2B39d791ddb30f39c1E57a3'], 
['Clause 1', 'Clause 2'],['Requested', 'In Progress', 'Denied', 'Accepted', 'Canceled'], {data: bytecode, from: web3.eth.accounts[0], gas: 6780000}, 
function (err, deployedContract) {
if (deployedContract.address) {
        console.log(`Address: ${deployedContract.address}`);
		interf = compiledContract.contracts['Reinsure.sol:ReinsuranceContract'].interface;
			
		add = deployedContract.address;
		abi = interf;
		let con = "contract = {address: '" + String(add) + "', ABI: '" + abi + "'};";
		fs.writeFile('contract_declaration.js', con, (err) => {  
			// In case of a error throw err. 
			if (err) throw err; 
		});
		
		console.log(interf);
		console.log("Contract was successfully deployed!");
    }
});





 