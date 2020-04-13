pragma experimental ABIEncoderV2;
pragma solidity "0.4.26";
//import "Strings.sol";

contract ReinsuranceContract {

    // using Modifiers for string;
    // using Modifiers for bytes32;

    bytes32[] private ContractClausesList;
    address[] private CompaniesList;
    int[] private AllRequestsIndexes;

    bytes32[] AllRequestStatuses = new bytes32[](5);

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

constructor (address[] _companyAddresses, bytes32[] _contractClauses, bytes32[] _requestStatuses) public{
        CompaniesList = _companyAddresses;
        ContractClausesList = _contractClauses;
        AllRequestStatuses = _requestStatuses;
     }

    modifier isValidCompany(address toValidate) {
        require(validCompany(toValidate));
        _;
    }

    function GetAvailableStatuses() public view returns (bytes32[]) {
        return AllRequestStatuses;
    }

    function GetRequestDetailsById(int id) public view returns(int, address, address, uint){
       // require(id.Contains(AllRequestsIndexes));

        Request storage req = AllRequests[id];
        return (req.Id, req.To, req.From, req.EtherDisposablePayment);
    }

    function GetRequestAmount(int reqId) public view returns (uint) {
        Request storage request = AllRequests[reqId]; 
        return request.EtherDisposablePayment;
    }

    function GetRequestsCount() public view returns (int){
        return AllContractRequestsCount;
    }

    function GetRequestIds() public view returns (int[]) {
        return AllRequestsIndexes;
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

    function isValidStatus(bytes32 status) view private returns (bool){
        bool ok = false;
         for(uint i = 0; i < AllRequestStatuses.length; i++) {
             if(AllRequestStatuses[i] == status) {
                 ok = true;
             }
         }
        return ok;
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

    function RequestReinsuranceTransaction(address from, address to, uint clauseId, uint payableEther) public isValidCompany(from) {
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
    }

    function ChangeRequestStatus(int requestId, bytes32 status) public payable isValidCompany(msg.sender) returns (bool) {
    require(isValidStatus(status));

       Request storage request = AllRequests[requestId];     
       request.Status = status;
       string memory accepted = 'Accepted';

        if(toBytes32(accepted) == status && request.To == msg.sender){
            request.From.transfer(request.EtherDisposablePayment); 
            emit ReceivedPayment(request.From, request.To, request.EtherDisposablePayment);  
            return true;         
        } 
        return false;
    }

    function fallback() external payable {
        //Nothing to do
        emit ReceivedPaymentContract(msg.sender, msg.value);
     }

    event ReceivedPayment(address from, address to, uint payment);
    event ReceivedPaymentContract(address from, uint256 payment);

   function toBytes32(string memory source) private pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }
}