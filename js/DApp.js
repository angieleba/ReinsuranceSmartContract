add = null;
contractInstance = null;

window.addEventListener('load', function () {
    // Load WEB3
    // Check wether it's already injected by something else (like Metamask or Parity Chrome plugin)
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);

        // Or connect to a node
    } else {
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    // Check the connection
    if (!web3.isConnected()) {
        console.error("Not connected");
    }

    var add = web3.eth.accounts[0];
    Contract = web3.eth.contract(JSON.parse(contract.ABI));
    contractInstance = Contract.at(contract.address);
    ReloadData(add);
});

window.ethereum.on('accountsChanged', function (accounts) {
    add = accounts[0];
    console.log("Changed", accounts[0]);
    ReloadData(accounts[0]);
});

function getAccount() {
    const accounts = ethereum.enable();
    const account = accounts[0];
    return account;
}
//Sends a new request with status Requested
function SendNewRequest() {
    add = web3.eth.accounts[0];
    var to = document.getElementById("listOfCompanies").value;
    var ether = document.getElementById("payableEther").value;
    var clause = document.getElementById("contractClauses").value;

    contractInstance.RequestReinsuranceTransaction
        .sendTransaction(add, to, clause, web3.toWei(ether, "ether"), { from: add, gas: 300000 }, function (err, result) {
            if (!err) {
                web3.eth.getTransactionReceipt(result, function(err, transReceipt) {
                    if (transReceipt.status == '0x1') {
                        $.notify("Request successfully created!", "success");
                        ReloadData(add);
                        window.location.href = "#fromMeRequestTable";
                    } else {
                        $.notify("Something went wrong. Please try again.", "error");
                    }
                });             
            } else {
                $.notify("MetaMask: User denied transaction.", "error");
            }
        });

}

function ChangeStatus() {
    var status = $("#statuses").val();
    var id = $("#requestId").val();
    add = web3.eth.accounts[0];

    contractInstance.GetRequestAmount.call(id, function (err, result) {
        var amount = 0;
        if(status == 'Accepted') {
            amount = result;
        }

        console.log(amount);

        contractInstance.ChangeRequestStatus
            .sendTransaction(id, status, { from: add, gas: 65000, value: amount }, function (err, receipt) {
            if (!err) {
                web3.eth.getTransactionReceipt(receipt, function (err, transReceipt) {
                    if (transReceipt.status == '0x1') {
                        $("#ChangeStatusModal").modal('hide');
                        $.notify("Status successfully changed!", "success");
                        ReloadData(add);
                    } else {
                        $.notify("Something went wrong. Please try again.", "error");
                        $("#ChangeStatusModal").modal('hide');
                    }
                });
            }
        });
    });
 

}

function ReloadData(add) {
    $("#user").html("Welcome, <b>" + add + "</b>");
    var event = contractInstance.ReceivedPayment();
    event.watch(function (error, result) {
        if (!error)
            console.log("Log results:", result);
    });

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

    var requestsToMeLength = 0;
    var requestsFromMeLength = 0;

    //Get all existing companies in the contract
    contractInstance.GetCompanies.call(function (err, receipt) {
        listEl = receipt;
        listEl.forEach(function (item) {
            options.push(new Option(item));
        });
        $('#listOfCompanies').html(options);
    });

    contractInstance.GetContractClauses.call(function (err, receipt) {
        clausesList = receipt;
        //Get all the clauses the contract covers
        clausesList.forEach(function (item) {
            clauses.push(new Option(web3.toUtf8(item), clausesList.indexOf(item)));
        });
        $('#contractClauses').html(clauses);
    });

    contractInstance.GetAllRequestsFromMe.call(add, function (err, result) {
        requestsFromMeLength = result[0].length;
        requestsFromMe = result;

        contractInstance.GetRequestDetailsFromMe.call(add, function (err, receipt) {
            requestDetailsFromMe = receipt;
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

            var button = new Button("btn btn-outline-primary", "Update",
                new Function("ChangeRequestStatus",
                    [{
                        isProp: true,
                        param: "Id"
                    }, {
                        isProp: false,
                        param: "false"
                    }]));

            BuildTable("fromMeRequestTable", fromMeRequestStructs, [button]);
        });
    });

    contractInstance.GetAllRequestsToMe.call(add, function (err, result) {
        requestsToMeLength = result[0].length;
        requestsToMe = result;

        contractInstance.GetRequestDetailsToMe.call(add, function (err, receipt) {
            requestDetailsToMe = receipt;

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

            var button = new Button("btn btn-outline-primary", "Update",
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
    });
}

function ChangeRequestStatus(id, toMe) {
    var statusList = [];
    var listEl = [];

    if (toMe) {
        statusList = ['In Progress', 'Accepted', 'Denied'];
    } else {
        statusList = ['Canceled'];
    }

    $("#statuses").html('');
    $("#requestId").val(id);

    contractInstance.GetAvailableStatuses.call(function (err, result) {
        listEl = result;
        listEl.forEach(element => {
            var el = web3.toUtf8(element);
            if (statusList.includes(el)) {
                $("#statuses").append(new Option(el));
            }
        });
        $("#ChangeStatusModal").modal('show');
    });
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