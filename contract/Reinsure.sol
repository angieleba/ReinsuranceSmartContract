pragma experimental ABIEncoderV2;
pragma solidity "0.4.26";
import "Strings.sol";

contract ReinsuranceContract {

    using Modifiers for bytes32;
    using Modifiers for int;
    using Modifiers for string;

    bytes32[] private ContractClausesList;
    address[] private CompaniesList;
    int[] private AllRequestsIndexes;
    string requested = 'Requested';
    string progress = 'In Progress';
    string denied = 'Denied';
    string accepted = 'Accepted';
    string canceled = 'Canceled';

    bytes32[] AllRequestStatuses = [requested.toBytes32(), progress.toBytes32(), denied.toBytes32(), accepted.toBytes32(), canceled.toBytes32()];

    struct Request {
        int Id;
        address From;
        address To;
        bytes32 ContractClause;
        uint EtherDisposablePayment;
        bytes32 Status;
        bytes32 StatusReason;
    }

    int AllContractRequestsCount = 0;
    mapping (int => Request) AllRequests;
    

    mapping (address => uint) FromMeRequestCount;
    mapping(address => uint) ToMeRequestCount;

constructor (address[] _companyAddresses, bytes32[] _contractClauses) public{
        CompaniesList = _companyAddresses;
        ContractClausesList = _contractClauses;
     }

    function GetContractStatuses() public view returns (bytes32[]) {
        return AllRequestStatuses;
    }

    function getRequestStatus(int Id) public view returns (bytes32) {
        return AllRequests[Id].Status;
    }

    modifier isValidCompany(address toValidate) {
        require(validCompany(toValidate));
        _;
    }

    function GetCompanies() public view returns (address[]) {
          return  CompaniesList;       
     }

    function GetContractClauses() public view returns (bytes32[]) {    
        return ContractClausesList;
    }

    function validCompany(address companyAddress) view private returns (bool) {
        for(uint i = 0; i < CompaniesList.length; i++) {
            if (CompaniesList[i] == companyAddress) {
                return true;
            }
        }
        return false;
    }


    function RequestReinsuranceTransaction(address from, address to, uint clauseId, uint payableEther) public isValidCompany(from) returns (bool) {
        AllContractRequestsCount = AllContractRequestsCount + 1;

        Request storage requesttt = AllRequests[AllContractRequestsCount];

        requesttt.Id = AllContractRequestsCount;
        requesttt.To = to;
        requesttt.From = from;
        requesttt.ContractClause = ContractClausesList[clauseId];
        requesttt.EtherDisposablePayment = payableEther;
        requesttt.Status = AllRequestStatuses[0];

        AllRequestsIndexes.push(AllContractRequestsCount);

        uint tempCountFrom = FromMeRequestCount[from];
        FromMeRequestCount[from] = tempCountFrom + 1;

        uint tempCountTo = ToMeRequestCount[to];
        ToMeRequestCount[to] = tempCountTo + 1;

        return true;
    }

    function GetRequestDetailsById(int id) public view returns(int, address, address, string){
       // require(id.Contains(AllRequestsIndexes));

        Request storage req = AllRequests[id];
        return (req.Id, req.To, req.From, req.Status.toString());
    }


    function GetRequestsCount() public view returns (int){
        return AllContractRequestsCount;
    }


    function GetRequestIds() public view returns (int[]) {
        return AllRequestsIndexes;
    }

    //Return all system requests made by my address 
    function GetAllRequestsFromMe(address from) public view isValidCompany(from) returns (int[] , address[], address[], bytes32[]){

        int[] memory indexes = new int[](FromMeRequestCount[from]);
        address[] memory fromAddresses = new address[](FromMeRequestCount[from]);
        address[] memory toAddresses = new address[](FromMeRequestCount[from]);
        bytes32[] memory statuses = new bytes32[](FromMeRequestCount[from]);

        uint IndexCount = 0;

        for(uint i=0; i < AllRequestsIndexes.length; i++) {
            int tempId = AllRequestsIndexes[i];
            if(AllRequests[tempId].From == from){

                Request memory tempRequest = AllRequests[tempId];

                indexes[IndexCount] = tempRequest.Id;
                fromAddresses[IndexCount] = tempRequest.From;
                toAddresses[IndexCount] = tempRequest.To; 
                statuses[IndexCount] = tempRequest.Status;

                IndexCount+=1;
            }
        }
        
        return (indexes, fromAddresses, toAddresses, statuses);
    }

    function GetRequestDetailsFromMe(address from) public view isValidCompany(from) returns (uint[], bytes32[], bytes32[]) {
        
        uint[] memory disponibleEthers = new uint[](FromMeRequestCount[from]);
        bytes32[] memory statusReasons = new bytes32[](FromMeRequestCount[from]);
        bytes32[] memory contractClauses = new bytes32[](FromMeRequestCount[from]);

        uint IndexCount = 0;

        for(uint i=0; i < AllRequestsIndexes.length; i++) {
            int tempId = AllRequestsIndexes[i];
            if(AllRequests[tempId].From == from){

                Request memory tempRequest = AllRequests[tempId];

                contractClauses[IndexCount] = tempRequest.ContractClause;
                disponibleEthers[IndexCount] = tempRequest.EtherDisposablePayment;         
                statusReasons[IndexCount] = tempRequest.StatusReason;

                IndexCount+=1;
            }
        }

        return (disponibleEthers, statusReasons, contractClauses);
    }

    // //Return all system requests made to me in order to validate 
    function GetAllRequestsToMe(address to) public view isValidCompany(to) returns (int[] , address[], address[], bytes32[]){

        int[] memory indexes = new int[](ToMeRequestCount[to]);
        address[] memory fromAddresses = new address[](ToMeRequestCount[to]);
        address[] memory toAddresses = new address[](ToMeRequestCount[to]);
        bytes32[] memory statuses = new bytes32[](ToMeRequestCount[to]);
        
        uint IndexCount = 0;

        for(uint i=0; i < AllRequestsIndexes.length; i++){
            int tempId = AllRequestsIndexes[i];
            if(AllRequests[tempId].To == to){

                Request memory tempRequest = AllRequests[tempId];

                indexes[IndexCount] = tempRequest.Id;
                fromAddresses[IndexCount] = tempRequest.From;
                toAddresses[IndexCount] = tempRequest.To;
                statuses[IndexCount] = tempRequest.Status; 

                IndexCount+=1;
            }
        }
        return (indexes, fromAddresses, toAddresses, statuses);
    }

    function GetRequestDetailsToMe(address to) public view isValidCompany(to) returns (uint[], bytes32[], bytes32[]){    

        uint[] memory disponibleEthers = new uint[](ToMeRequestCount[to]);
        bytes32[] memory statusReasons = new bytes32[](ToMeRequestCount[to]);
        bytes32[] memory contractClauses = new bytes32[](ToMeRequestCount[to]);

        uint IndexCount = 0;

        for(uint i=0; i < AllRequestsIndexes.length; i++){
             int tempId = AllRequestsIndexes[i];

            if(AllRequests[tempId].To == to){

                Request memory tempRequest = AllRequests[tempId];

                disponibleEthers[IndexCount] = tempRequest.EtherDisposablePayment;
                statusReasons[IndexCount] = tempRequest.StatusReason;
                contractClauses[IndexCount] = tempRequest.ContractClause;

                IndexCount+=1;
            }
        }

        return (disponibleEthers, statusReasons, contractClauses);
    }

    //NOTE: STATUS SHOULD BE CHANGED ONLY FOR THE TO-ME REQUESTS
    function ChangeRequestStatus(int requestId, uint status) public isValidCompany(msg.sender) returns (bool) {

       Request storage request = AllRequests[requestId];
       request.Status = AllRequestStatuses[status];
        // if(status == Accepted){
        //     send ether to the TO address
        // }
        return true;
    }

   event NewRequest(address from, address to, uint clauseId, uint payableEther);
 }