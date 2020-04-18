# ReinsuranceSmartContract

Requirements: 

- Node JS
- ganache-cli package (to simulate a blockchain network)
- lite-server (in order to host the application. Required for the MetaMask wallet because: "Due to browser security restrictions, we can't communicate with dapps running on file://")
- MetaMask wallet v7.7.8 (other versions might go but the DApp has been tested only with this version)
- Internet (for some libraries like bootstrap and Web3.js)


Steps of istallation: 

1. Download repository
2. Run ganache-cli command to start the local blockchain
3. Open js file called deploy.js and update the constructor of the contract. The array of addresses for the reinsurance companies has to be 
of valid addresses from the blockchain simulation of point 3.
4. Open another cmd pointing to the directory of the project and paste che command 'node deploy.js'. 
This will deploy the smart contract and write in contract_declaration.js the contract address and ABI, necessary to have a contract instance in DApp. 
5. Connect to local network (usually Localhost 8545) and import local accounts in MetaMask (required for account injection)
6. Open another cmq and run 'npm run dev'. This will load the DApp and enable communication with the deployed contract 
7. You should be good to go

