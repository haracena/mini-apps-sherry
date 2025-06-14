// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract TelegramGroupInvitations is ReentrancyGuard {
    struct Group {
        address owner;
        uint256 price; // en wei
        uint256 referralCommission; // porcentaje (0-100)
        bool exists;
    }

    // groupId => Group
    mapping(string => Group) public groups;

    // groupId => user => bool
    mapping(string => mapping(address => bool)) public hasBought;

    // Plataforma
    address public platformOwner;
    uint256 public platformFee = 0.01 ether; // 0.01 AVAX
    uint256 public accumulatedFees;

    event GroupCreated(string indexed groupId, address indexed owner, uint256 price, uint256 referralCommission);
    event GroupUpdated(string indexed groupId, uint256 price, uint256 referralCommission);
    event InvitationBought(string indexed groupId, address indexed buyer, address indexed referrer, uint256 amount, uint256 commission, uint256 platformFee);
    event PlatformFeeWithdrawn(address indexed to, uint256 amount);

    modifier onlyGroupOwner(string memory groupId) {
        require(groups[groupId].exists, "Group does not exist");
        require(groups[groupId].owner == msg.sender, "Not group owner");
        _;
    }

    modifier onlyPlatformOwner() {
        require(msg.sender == platformOwner, "Not platform owner");
        _;
    }

    constructor() {
        platformOwner = msg.sender;
    }

    function createGroup(
        string calldata groupId,
        uint256 price,
        uint256 referralCommission
    ) external {
        require(!groups[groupId].exists, "Group already exists");
        require(referralCommission >= 0 && referralCommission <= 100, "Commission must be 0-100");
        require(price > 0, "Price must be > 0");

        groups[groupId] = Group({
            owner: msg.sender,
            price: price,
            referralCommission: referralCommission,
            exists: true
        });

        emit GroupCreated(groupId, msg.sender, price, referralCommission);
    }

    function updateGroup(
        string calldata groupId,
        uint256 price,
        uint256 referralCommission
    ) external onlyGroupOwner(groupId) {
        require(referralCommission <= 100, "Commission must be 0-100");
        require(price > 0, "Price must be > 0");

        groups[groupId].price = price;
        groups[groupId].referralCommission = referralCommission;

        emit GroupUpdated(groupId, price, referralCommission);
    }

    function buyInvitation(
        string calldata groupId,
        address referrer
    ) external payable nonReentrant {
        Group memory group = groups[groupId];
        require(group.exists, "Group does not exist");
        require(msg.value == group.price + platformFee, "Incorrect AVAX amount");
        require(!hasBought[groupId][msg.sender], "Already bought");

        hasBought[groupId][msg.sender] = true;

        // Cobrar fee de plataforma
        accumulatedFees += platformFee;

        uint256 commission = 0;
        uint256 distributable = group.price;
        if (referrer != address(0) && referrer != msg.sender && group.referralCommission > 0) {
            commission = (group.price * group.referralCommission) / 100;
            (bool sentRef, ) = referrer.call{value: commission}("");
            require(sentRef, "Failed to send commission");
            distributable -= commission;
        }

        (bool sentOwner, ) = group.owner.call{value: distributable}("");
        require(sentOwner, "Failed to send profit");

        emit InvitationBought(groupId, msg.sender, referrer, msg.value, commission, platformFee);
    }

    // Consultar datos del grupo
    function getGroup(string calldata groupId) external view returns (
        address owner,
        uint256 price,
        uint256 referralCommission,
        bool exists
    ) {
        Group memory group = groups[groupId];
        return (group.owner, group.price, group.referralCommission, group.exists);
    }

    // Saber si un usuario ya compró
    function hasUserBought(string calldata groupId, address user) external view returns (bool) {
        return hasBought[groupId][user];
    }

    // Retirar fees acumulados (solo el owner de la plataforma)
    function withdrawFees() external onlyPlatformOwner {
        uint256 amount = accumulatedFees;
        require(amount > 0, "No fees to withdraw");
        accumulatedFees = 0;
        (bool sent, ) = platformOwner.call{value: amount}("");
        require(sent, "Withdraw failed");
        emit PlatformFeeWithdrawn(platformOwner, amount);
    }

    // Cambiar el owner de la plataforma
    function setPlatformOwner(address newOwner) external onlyPlatformOwner {
        require(newOwner != address(0), "Invalid address");
        platformOwner = newOwner;
    }

    // Cambiar el fee de plataforma
    function setPlatformFee(uint256 newFee) external onlyPlatformOwner {
        platformFee = newFee;
    }
}