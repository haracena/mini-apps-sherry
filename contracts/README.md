# Daily Streak Smart Contract

## Overview

The DailyStreak contract implements an on-chain daily wheel game where users can spin once per day to earn points and build streaks.

## Features

- Daily spin (resets at 12:00 UTC)
- Point rewards ranging from 10-150 points
- Streak tracking (consecutive days played)
- Automatic streak reset if a day is missed
- On-chain randomness for prize selection

## Prize Distribution

- 40% chance: 10-20 points
- 30% chance: 30-40 points
- 20% chance: 50-70 points
- 8% chance: 80-100 points
- 2% chance: 120-150 points

## Deployment

### Using Remix IDE

1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Create a new file `DailyStreak.sol`
3. Copy the contract code from `contracts/DailyStreak.sol`
4. Compile with Solidity version `^0.8.20`
5. Deploy to Avalanche network:
   - Network: Avalanche C-Chain
   - Chain ID: 43114
   - RPC: https://api.avax.network/ext/bc/C/rpc
6. Save the deployed contract address
7. Update `config/contracts.ts` with the new address

### Using Hardhat

```bash
# Install dependencies
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Create hardhat config
npx hardhat init

# Add Avalanche network to hardhat.config.js
networks: {
  avalanche: {
    url: 'https://api.avax.network/ext/bc/C/rpc',
    chainId: 43114,
    accounts: [process.env.PRIVATE_KEY]
  }
}

# Deploy
npx hardhat run scripts/deploy.js --network avalanche
```

### Verification

After deployment, update:

1. `config/contracts.ts` - Add contract address
2. Test on testnet first (Fuji): https://testnet.snowtrace.io/

## Contract Functions

### Read Functions

- `getPlayerData(address player)` - Get player stats
- `canSpin(address player)` - Check if player can spin
- `timeUntilNextSpin(address player)` - Time until next spin
- `hasActiveStreak(address player)` - Check if streak is active
- `getCurrentDay()` - Get current day number

### Write Functions

- `spin()` - Spin the wheel (once per day)

## Events

- `SpinCompleted` - Emitted when a player spins
- `StreakLost` - Emitted when a player loses their streak

## Security Notes

- Randomness uses block data (suitable for low-value applications)
- For high-value applications, consider using Chainlink VRF
- No funds are stored in the contract
- All data is publicly readable on-chain

## Testing

Test the contract on Avalanche Fuji Testnet first:
- Faucet: https://faucet.avax.network/
- Explorer: https://testnet.snowtrace.io/
