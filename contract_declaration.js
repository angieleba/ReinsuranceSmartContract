contract = {address: '0xeeb94c6654cf5506305adef6c3e2bcbe52d908a0', ABI: '[{"constant":true,"inputs":[{"name":"reqId","type":"int256"}],"name":"GetRequestAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"GetContractClauses","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"from","type":"address"}],"name":"GetAllRequestsFromMe","outputs":[{"name":"","type":"int256[]"},{"name":"","type":"address[]"},{"name":"","type":"address[]"},{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"GetCompanies","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"fallback","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"id","type":"int256"}],"name":"GetRequestDetailsById","outputs":[{"name":"","type":"int256"},{"name":"","type":"address"},{"name":"","type":"address"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"to","type":"address"}],"name":"GetAllRequestsToMe","outputs":[{"name":"","type":"int256[]"},{"name":"","type":"address[]"},{"name":"","type":"address[]"},{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"requestId","type":"int256"},{"name":"status","type":"bytes32"}],"name":"ChangeRequestStatus","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"GetAvailableStatuses","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"to","type":"address"}],"name":"GetRequestDetailsToMe","outputs":[{"name":"","type":"uint256[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"clauseId","type":"uint256"},{"name":"payableEther","type":"uint256"}],"name":"RequestReinsuranceTransaction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"GetRequestIds","outputs":[{"name":"","type":"int256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"GetRequestsCount","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"from","type":"address"}],"name":"GetRequestDetailsFromMe","outputs":[{"name":"","type":"uint256[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_companyAddresses","type":"address[]"},{"name":"_contractClauses","type":"bytes32[]"},{"name":"_requestStatuses","type":"bytes32[]"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"payment","type":"uint256"}],"name":"ReceivedPayment","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"payment","type":"uint256"}],"name":"ReceivedPaymentContract","type":"event"}]'};