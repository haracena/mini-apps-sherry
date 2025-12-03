// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title MintableNFT
 * @notice ERC721 NFT contract with configurable mint price
 * @dev Allows users to mint NFTs by paying the specified price
 */
contract MintableNFT is ERC721, ERC721URIStorage, Ownable {
    using Strings for uint256;

    uint256 private _nextTokenId;
    uint256 public mintPrice;

    mapping(uint256 => string) private _tokenMetadata;
    mapping(address => uint256[]) private _userTokens;

    event NFTMinted(
        address indexed minter,
        uint256 indexed tokenId,
        string tokenURI,
        uint256 price,
        uint256 timestamp
    );

    event MintPriceUpdated(
        uint256 oldPrice,
        uint256 newPrice,
        uint256 timestamp
    );

    /**
     * @notice Constructor
     * @param initialMintPrice Initial price in wei (e.g., 0.0001 ETH = 100000000000000 wei)
     */
    constructor(uint256 initialMintPrice)
        ERC721("Sherry NFT Collection", "SHERRY")
        Ownable(msg.sender)
    {
        mintPrice = initialMintPrice;
    }

    /**
     * @notice Mint a new NFT
     * @param tokenURI IPFS URI for the NFT metadata
     * @return tokenId ID of the minted token
     */
    function mint(string memory tokenURI) public payable returns (uint256) {
        require(msg.value >= mintPrice, "Insufficient payment");
        require(bytes(tokenURI).length > 0, "Token URI cannot be empty");

        uint256 tokenId = _nextTokenId++;

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        _tokenMetadata[tokenId] = tokenURI;
        _userTokens[msg.sender].push(tokenId);

        emit NFTMinted(msg.sender, tokenId, tokenURI, msg.value, block.timestamp);

        // Refund excess payment
        if (msg.value > mintPrice) {
            payable(msg.sender).transfer(msg.value - mintPrice);
        }

        return tokenId;
    }

    /**
     * @notice Update mint price (only owner)
     * @param newPrice New price in wei
     */
    function setMintPrice(uint256 newPrice) external onlyOwner {
        uint256 oldPrice = mintPrice;
        mintPrice = newPrice;
        emit MintPriceUpdated(oldPrice, newPrice, block.timestamp);
    }

    /**
     * @notice Get all tokens owned by an address
     * @param owner Address to query
     * @return Array of token IDs
     */
    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
        return _userTokens[owner];
    }

    /**
     * @notice Get total number of minted tokens
     * @return Total supply
     */
    function totalSupply() external view returns (uint256) {
        return _nextTokenId;
    }

    /**
     * @notice Withdraw contract balance (only owner)
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }

    /**
     * @notice Get contract balance
     * @return Balance in wei
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Required overrides
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
