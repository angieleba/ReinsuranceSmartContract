pragma solidity "0.4.25";


library Modifiers {

    //Checks if an array of int contains a specific number
    // function Contains( int valueToCheck, int[] indexes) returns (bool) {
    //     for(uint i = 0; i < indexes.length; i++) {
    //         if (indexes[i] == valueToCheck) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    // function concat (string _base, string _value) internal returns (string) {
    //     bytes memory _baseBytes = bytes(_base);
    //     bytes memory _valueBytes = bytes(_value);

    //     //to temporarily save the length of bytes of the string concatenation
    //     string memory _tempString = new string(_baseBytes.length + _valueBytes.length);
    //     bytes memory newBytes = bytes(_tempString);

    //     uint i;
    //     uint j;

    //     for(i = 0; i < _baseBytes.length; i++){
    //         newBytes[j++] = _baseBytes[i];
    //     }
    // } 


    function toString(bytes32 x) pure internal returns (string) {
        bytes memory bytesString = new bytes(32);
        uint charCount = 0;
        for (uint j = 0; j < 32; j++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
        }
        return string(bytesStringTrimmed);
    }
}