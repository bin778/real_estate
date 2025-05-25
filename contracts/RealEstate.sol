// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RealEstate {
    address public admin;
    uint public nextPropertyId;

    struct Property {
        uint id;
        string location;
        uint price;
        address owner;
        bool isAvailable;
    }

    mapping(uint => Property) public properties;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only Administrator");
        _;
    }

    function registerProperty(string memory _location, uint _price) public onlyAdmin {
        properties[nextPropertyId] = Property(nextPropertyId, _location, _price, admin, true);
        nextPropertyId++;
    }

    function buyProperty(uint _id) public payable {
        Property storage p = properties[_id];
        require(p.isAvailable, "Already Sold");
        require(msg.value >= p.price, "Less Than Price");

        p.owner = msg.sender;
        p.isAvailable = false;

        payable(admin).transfer(msg.value);
    }

    function deleteProperty(uint _id) public onlyAdmin {
        require(_id < nextPropertyId, "Invalid Property ID");
        delete properties[_id];
    }

    function getProperty(uint _id) public view returns (
        string memory, uint, address, bool
    ) {
        Property storage p = properties[_id];
        return (p.location, p.price, p.owner, p.isAvailable);
    }
}
