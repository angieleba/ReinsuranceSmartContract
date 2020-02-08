pragma solidity "^0.4.25";
pragma experimental "ABIEncoderV2";

contract DataStorage{

struct Reinsured{
         Reinsurer Reinsurer;
         uint Risk;
         uint Percentage;
         bool exists;
    }

struct Reinsurer {
    address Address;
    Reinsured[] Reinsured;
}
     
    address private owner;

    mapping(uint => Reinsurer) Reinsurers;

    modifier onlyOwner {
        require(owner == msg.sender);
        _;
    }

    function DataStorage() public{
         owner = msg.sender;
    }
   
   function getReinsuranceRequest(address reinsurer, address reinsured) returns(Reinsurer){
       require(UserExists(reinsurer));
       return Reinsurers[reinsurer];
   }

    function UserExists(address user) returns(bool){
       return Reinsurers[user].exists;
    }

    function populateDatabase() public onlyOwner{

    }
}