Web3 = require('web3');
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
Contract = web3.eth.contract(JSON.parse(contract.ABI));
contractInstance = Contract.at(contract.address)

$(document).ready(function () {
    var add = web3.eth.accounts[0];

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

    listEl.forEach(function (item) {
        options.push(new Option(item));
    });
    $('#listOfCompanies').html(options);

    //Get all the clauses the contract covers
    clausesList.forEach(function (item) {
        clauses.push(new Option(web3.toUtf8(item), clausesList.indexOf(item)));
    });
    $('#contractClauses').html(clauses);


    //1. Populate table of list of requests FROM ME
    for (var i = 0; i < requestsFromMeLength; i++) {
        const Request = {
            Id: requestsFromMe[ID][i],
            From: requestsFromMe[FROM][i],
            To: requestsFromMe[TO][i],
            Status: web3.toUtf8(requestsFromMe[STATUS][i]),
            Ether: web3.fromWei(requestDetailsFromMe[ETHER][i], 'ether'),
            Reasons: requestDetailsFromMe[REASONS][i],
            Clause: web3.toUtf8(requestDetailsFromMe[CLAUSE][i])
        }

        fromMeRequestStructs.push(Request);
    }

    var button = new Button("btn btn-outline-primary", "Change status",
        new Function("ChangeRequestStatus",
            [{
                isProp: true,
                param: "Id"
            }, {
                isProp: false,
                param: "false"
            }]));

    BuildTable("fromMeRequestTable", fromMeRequestStructs, [button]);

    //2. Populate table of list of requests TO ME
    for (var i = 0; i < requestsToMeLength; i++) {
        const Request = {
            Id: requestsToMe[ID][i],
            From: requestsToMe[FROM][i],
            To: requestsToMe[TO][i],
            Status: web3.toUtf8(requestsToMe[STATUS][i]),
            Ether: web3.fromWei(requestDetailsToMe[ETHER][i], 'ether'),
            Reasons: requestDetailsToMe[REASONS][i],
            Clause: web3.toUtf8(requestDetailsToMe[CLAUSE][i])
        }

        toMeRequestStructs.push(Request);
    }

    var button = new Button("btn btn-outline-primary", "Change status",
        new Function("ChangeRequestStatus",
            [{
                isProp: true,
                param: "Id"
            }, {
                isProp: false,
                param: "true"
            }]));

    BuildTable("toMeRequestTable", toMeRequestStructs, [button]);
});

//Sends a new request with status Requested
function SendNewRequest() {
    var add = web3.eth.accounts[0];
    var to = document.getElementById("listOfCompanies").value;
    var ether = document.getElementById("payableEther").value;
    var clause = document.getElementById("contractClauses").value;
    var one = 1;
    var handleReceipt = (error, receipt) => {
        if (error) console.error(error);
        else {
            console.log("=>", receipt);
            //   res.json(receipt);
        }
    }

    var result = contractInstance.RequestReinsuranceTransaction.sendTransaction(add, to, clause, web3.toWei(ether, "ether"), { from: add, gas: 300000 }, handleReceipt);
    console.log(result);
    //location.reload();
}


//Function to change the status of the requests
function ChangeRequestStatus(id, toMe) {
    var statusList = [];
    if (toMe) {
        statusList = ['In Progress', 'Accepted', 'Denied'];
    } else {
        statusList = ['Canceled'];
    }

    $("#statuses").html('');
    $("#requestId").val(id);

    var listEl = contractInstance.GetAvailableStatuses.call();
    listEl.forEach(element => {
        var el = web3.toUtf8(element);
        if (statusList.includes(el)) {
            $("#statuses").append(new Option(el));
        }
    });
    $("#ChangeStatusModal").modal('show');
}

function ChangeStatus() {
    var opt = $("#statuses").val();
    var id =  $("#requestId").val();
    console.log(opt, id);
    var result = contractInstance.ChangeRequestStatus.call(id, 'Accepted');
    console.log(result);
}

class Button {
    constructor(className, label, func) {
        this._className = className;
        this._label = label;
        this._function = func;
    }
}

class Function {
    constructor(name, params) {
        this._name = name;
        this._params = params;
    }
}