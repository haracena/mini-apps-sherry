# NFT Contract Deployment Guide

This guide explains how to deploy the MintableNFT smart contract to the Avalanche C-Chain network.

## Prerequisites

- Hardhat or Remix IDE
- AVAX for gas fees
- Wallet with deployment permissions

## Contract Details

- **Contract**: MintableNFT.sol
- **Standard**: ERC721
- **Network**: Avalanche C-Chain (Chain ID: 43114)
- **Initial Mint Price**: 0.0001 AVAX (configurable)

## Deployment Steps

### Option 1: Using Hardhat

1. Install dependencies:
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts
```

2. Create `hardhat.config.js`:
```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    avalanche: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      chainId: 43114,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
```

3. Create deployment script `scripts/deploy-nft.js`:
```javascript
const hre = require("hardhat");
const { parseEther } = require("viem");

async function main() {
  const initialMintPrice = parseEther("0.0001");

  const MintableNFT = await hre.ethers.getContractFactory("MintableNFT");
  const nft = await MintableNFT.deploy(initialMintPrice);

  await nft.waitForDeployment();

  console.log("MintableNFT deployed to:", await nft.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

4. Deploy:
```bash
npx hardhat run scripts/deploy-nft.js --network avalanche
```

### Option 2: Using Remix IDE

1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Create a new file `MintableNFT.sol` and paste the contract code
3. Install OpenZeppelin contracts plugin
4. Compile the contract with Solidity 0.8.20
5. Connect MetaMask to Avalanche C-Chain
6. Deploy with initial mint price: `100000000000000` (0.0001 AVAX in wei)

## Post-Deployment

1. Copy the deployed contract address
2. Update `config/contracts.ts`:
```typescript
MINTABLE_NFT: "0xYourDeployedAddress" as `0x${string}`,
```

3. Verify the contract on Snowtrace (optional but recommended):
```bash
npx hardhat verify --network avalanche <CONTRACT_ADDRESS> <INITIAL_MINT_PRICE>
```

## Environment Setup

Add the contract address to your `.env.local`:
```
NEXT_PUBLIC_MINTABLE_NFT_ADDRESS=0xYourDeployedAddress
```

## Testing the Contract

After deployment, test the following functions:

1. **Mint an NFT**: Call `mint()` with a valid tokenURI and mint price
2. **Check owner**: Call `owner()` to verify deployer is the owner
3. **Get mint price**: Call `mintPrice()` to verify the initial price
4. **Update price**: Call `setMintPrice()` as owner
5. **Withdraw funds**: Call `withdraw()` as owner

## Contract Functions

### Public Functions
- `mint(string tokenURI)` - Mint a new NFT (payable)
- `mintPrice()` - Get current mint price
- `tokensOfOwner(address)` - Get all token IDs owned by an address
- `tokenURI(uint256)` - Get metadata URI for a token

### Owner Functions
- `setMintPrice(uint256)` - Update the mint price
- `withdraw()` - Withdraw contract balance to owner

## Security Considerations

- The contract inherits from OpenZeppelin's audited implementations
- Only the owner can withdraw funds
- Only the owner can update the mint price
- Minters receive refunds for excess payment
- Token URIs are immutable after minting

## Support

For issues or questions, check the contract code in `contracts/MintableNFT.sol` or review the ABI in `abi/MintableNFT.ts`.
