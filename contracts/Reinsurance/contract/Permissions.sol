
// pragma experimental "ABIEncoderV2";
pragma solidity "0.4.25";

contract Permissions {
    
    address public owner;
    
    // modifier isOwner(){
    //     require(owner == msg.sender);
        
    //     _;
    // }
    
    // modifier onlyOwner() {
    //     if(msg.sender != owner) revert();
    //     _;
    // }
    
    // constructor () public{
    //     owner = msg.sender;
    // }
    
    
    // function kill() onlyOwner private {
    //     selfdestruct(owner);
    // }
}