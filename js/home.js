var interface = '[{"constant":true,"inputs":[],"name":"GetContractStatuses","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"GetContractClauses","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"clauseId","type":"uint256"},{"name":"payableEther","type":"uint256"}],"name":"requestReinsuranceTransaction","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"from","type":"address"}],"name":"GetAllRequestsFromMe","outputs":[{"name":"","type":"int256[]"},{"name":"","type":"address[]"},{"name":"","type":"address[]"},{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"GetCompanies","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"adressa","type":"address"}],"name":"GetCompanyName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"id","type":"int256"}],"name":"GetRequestDetailsById","outputs":[{"name":"","type":"int256"},{"name":"","type":"address"},{"name":"","type":"address"},{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"to","type":"address"}],"name":"GetAllRequestsToMe","outputs":[{"name":"","type":"int256[]"},{"name":"","type":"address[]"},{"name":"","type":"address[]"},{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"Id","type":"int256"}],"name":"getRequestStatus","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"requestId","type":"int256"},{"name":"status","type":"uint256"}],"name":"ChangeRequestStatus","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"to","type":"address"}],"name":"GetRequestDetailsToMe","outputs":[{"name":"","type":"uint256[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"GetRequestIds","outputs":[{"name":"","type":"int256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"GetRequestsCount","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"from","type":"address"}],"name":"GetRequestDetailsFromMe","outputs":[{"name":"","type":"uint256[]"},{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_companyAddresses","type":"address[]"},{"name":"_companyNames","type":"bytes32[]"},{"name":"_contractClauses","type":"bytes32[]"},{"name":"_requestStatuses","type":"bytes32[]"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]';
Web3 = require('web3');

web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
abi = JSON.parse(interface);

Contract = web3.eth.contract(abi);
contractInstance = Contract.at('0xf83feb2c616b44732fe709b6e4a00c02a5f69981')


$(document).ready(function() { 
    var add = '0x1557b4561b80921dbed2cc8a659d2c5817cea77c';

    document.getElementById('listOfCompanies');
    var options = [];
    var clauses = [];

    var requestsFromMe = [];
    var requestDetailsFromMe = [];
    let fromMeRequestStructs = [];

    var requestsToMe = [];
    var requestDetailsToMe = [];
    let toMeRequestStructs = [];

    const ID = 0;
    const FROM = 1;
    const TO = 2;
    const STATUS = 3;
    const ETHER = 0;
    const REASONS = 1;
    const CLAUSE = 2;

    //Get all existing companies in the contract
    var listEl = contractInstance.GetCompanies.call();
    var clausesList = contractInstance.GetContractClauses.call(); 

    requestsFromMe = contractInstance.GetAllRequestsFromMe.call(add);
    requestDetailsFromMe = contractInstance.GetRequestDetailsFromMe.call(add);
    const requestsFromMeLength = requestsFromMe[0].length;

    requestsToMe = contractInstance.GetAllRequestsToMe.call(add);
    requestDetailsToMe = contractInstance.GetRequestDetailsToMe.call(add);
    const requestsToMeLength = requestsToMe[0].length;

    console.log(requestsToMe);
    console.log("Length: " + requestsToMeLength);

    listEl.forEach(function (item) {
        var option = "<option>" + item + "</option>"
        options.push(option);
    });

    $('#listOfCompanies').html(options);

    //Get all the clauses the contract covers
    clausesList.forEach(function (item) {
        var clause = "<option value = "+ clausesList.indexOf(item) +">" + web3.toUtf8(item) + "</option>";

        clauses.push(clause);
    });

    $('#contractClauses').html(clauses);


    //1. Populate table of list of requests FROM ME
    for(var i = 0; i < requestsFromMeLength; i++){
        const Request = {
            Id : requestsFromMe[ID][i],
            From : requestsFromMe[FROM][i],
            To : requestsFromMe[TO][i],
            Status : web3.toUtf8(requestsFromMe[STATUS][i]),
            Ether : requestDetailsFromMe[ETHER][i],
            Reasons : requestDetailsFromMe[REASONS][i],
            Clause : web3.toUtf8(requestDetailsFromMe[CLAUSE][i]) 
        }

        fromMeRequestStructs.push(Request);
    }

    var tableRowsFrom = [];

    for(var i = 0; i < fromMeRequestStructs.length; i++) {
        var row = "<tr>"  
        + "<td>" + fromMeRequestStructs[i].Id +"</td><td>" + fromMeRequestStructs[i].From +"</td><td>" + fromMeRequestStructs[i].To +"</td><td>" + fromMeRequestStructs[i].Clause +"</td><td>" + fromMeRequestStructs[i].Ether +"</td><td>" + fromMeRequestStructs[i].Status +"</td>" +
        "<td><button type='button' class='btn btn-outline-primary' onclick='ChangeRequestStatus(" + fromMeRequestStructs[i].Id + "," + fromMeRequestStructs[i].Id + ");'>Change status</button></td>"
        + "</tr>";
        tableRowsFrom.push(row);
    }

    $('#fromMeRequestTable').html(tableRowsFrom);
    //END OF FROM ME

    //2. Populate table of list of requests TO ME
    for(var i = 0; i < requestsToMeLength; i++){
        const Request = {
            Id : requestsToMe[ID][i],
            From : requestsToMe[FROM][i],
            To : requestsToMe[TO][i],
            Status : web3.toUtf8(requestsToMe[STATUS][i]),
            Ether : requestDetailsToMe[ETHER][i],
            Reasons : requestDetailsToMe[REASONS][i],
            Clause :  web3.toUtf8(requestDetailsToMe[CLAUSE][i]) 
        }

        toMeRequestStructs.push(Request);
    }

    var tableRowsTo = [];

    for(var i = 0; i < toMeRequestStructs.length; i++) {
        var row = "<tr>"  
        + "<td>" + toMeRequestStructs[i].Id +"</td><td>" + toMeRequestStructs[i].From +"</td><td>" + toMeRequestStructs[i].To +"</td><td>" + toMeRequestStructs[i].Clause +"</td><td>" + toMeRequestStructs[i].Ether +"</td><td>" + toMeRequestStructs[i].Status +"</td>" +
        "<td><button type='button' class='btn btn-outline-primary' onclick='ChangeRequestStatus(" + toMeRequestStructs[i].Id + "," + toMeRequestStructs[i].Id + ");'>Change status</button></td>"
        + "</tr>";
        tableRowsTo.push(row);
    }

    $('#toMeRequestTable').html(tableRowsTo);

});

//Sends a new request with status Requested
function SendNewRequest() {
    var add = '0x1557b4561b80921dbed2cc8a659d2c5817cea77c';
    var to = document.getElementById("listOfCompanies").value;  
    var ether = document.getElementById("payableEther").value;
    var clause = document.getElementById("contractClauses").value;

    var e = document.getElementById("contractClauses");
    var selectedClause = e.options[e.selectedIndex].value;
    console.log("====>" + selectedClause);
    console.log(to, ether, clause);
    
   var result = contractInstance.requestReinsuranceTransaction.sendTransaction(add, to, 0, 13, {from: add, gas: 221000});
   console.log(result);
    
   if(result){
    }

    location.reload();
}


//Function to change the status of the requests
function ChangeRequestStatus( id,  status){
    console.log(id, status);
}