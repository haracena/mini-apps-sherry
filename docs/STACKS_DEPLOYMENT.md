# Stacks Deployment Guide

Complete guide for deploying Clarity smart contracts to Stacks blockchain.

## 📋 Prerequisites

### 1. Install Clarinet

```bash
# Using npm
npm install -g @hirosystems/clarinet

# Or using Homebrew (macOS)
brew install clarinet

# Verify installation
clarinet --version
```

### 2. Get STX Tokens

**Testnet:**
- Use Stacks faucet: https://explorer.hiro.so/sandbox/faucet?chain=testnet
- Receive 500 STX for testing

**Mainnet:**
- Purchase STX from exchanges
- Transfer to your wallet

### 3. Setup Wallet

Recommended wallets:
- **Leather** - https://leather.io/
- **Xverse** - https://xverse.app/
- **Asigna** - https://asigna.io/

---

## 🚀 Deployment Steps

### Step 1: Initialize Project

```bash
# Navigate to project
cd mini-apps-sherry

# Initialize Clarinet (if not done)
clarinet integrate
```

This creates:
- `Clarinet.toml` - Project configuration
- `settings/` - Network settings
- `.clarinet/` - Local blockchain data

### Step 2: Configure Contracts

Create/update `Clarinet.toml`:

```toml
[project]
name = "social-triggers"
description = "Daily streak and NFT collection contracts"
authors = []
telemetry = false
cache_dir = ".cache"

[contracts.daily-streak]
path = "contracts/clarity/daily-streak.clar"
clarity_version = 2

[contracts.nft-collection]
path = "contracts/clarity/nft-collection.clar"
clarity_version = 2
```

### Step 3: Check Contracts

```bash
# Syntax check
clarinet check

# Expected output:
# ✅ daily-streak checked
# ✅ nft-collection checked
```

### Step 4: Local Testing

```bash
# Start local blockchain
clarinet devnet start

# In another terminal, run tests
clarinet test
```

### Step 5: Deploy to Testnet

```bash
# Deploy to testnet
clarinet deploy --testnet

# Follow prompts:
# 1. Select wallet
# 2. Confirm transactions
# 3. Wait for deployment
```

**Expected Output:**
```
✅ daily-streak deployed at ST...ABC.daily-streak
✅ nft-collection deployed at ST...ABC.nft-collection
```

### Step 6: Update Configuration

Update contract addresses in:

**1. `config/stacks.ts`:**
```typescript
export const STACKS_CONTRACTS = {
  dailyStreak: {
    testnet: 'ST1ABC...XYZ.daily-streak', // Your address
    mainnet: '',
  },
  nftCollection: {
    testnet: 'ST1ABC...XYZ.nft-collection', // Your address
    mainnet: '',
  },
} as const;
```

**2. `.env`:**
```bash
NEXT_PUBLIC_STACKS_NETWORK=testnet
NEXT_PUBLIC_STACKS_DAILY_STREAK_CONTRACT=ST1ABC...XYZ.daily-streak
NEXT_PUBLIC_STACKS_NFT_CONTRACT=ST1ABC...XYZ.nft-collection
```

### Step 7: Verify Deployment

Visit Stacks Explorer:
- Testnet: https://explorer.hiro.so/?chain=testnet
- Search for your contract address
- Verify code and transactions

---

## 🌐 Mainnet Deployment

**⚠️ IMPORTANT: Deploy to testnet first and test thoroughly!**

### Pre-Deployment Checklist

- [ ] Contracts tested on testnet
- [ ] All functions working correctly
- [ ] Security review completed
- [ ] Sufficient STX for deployment (~50 STX per contract)
- [ ] Backup of wallet seed phrase

### Deploy to Mainnet

```bash
# Deploy to mainnet
clarinet deploy --mainnet

# Confirm each contract deployment
```

### Post-Deployment

1. Update production config:
```typescript
// config/stacks.ts
export const STACKS_CONTRACTS = {
  dailyStreak: {
    mainnet: 'SP1ABC...XYZ.daily-streak',
  },
  nftCollection: {
    mainnet: 'SP1ABC...XYZ.nft-collection',
  },
};
```

2. Update environment:
```bash
NEXT_PUBLIC_STACKS_NETWORK=mainnet
```

3. Verify on explorer:
   - https://explorer.stacks.co

---

## 🧪 Testing Deployment

### Test Daily Streak Contract

```bash
# Using Clarinet console
clarinet console

# Run commands:
>>> (contract-call? .daily-streak spin)
>>> (contract-call? .daily-streak get-player-info tx-sender)
>>> (contract-call? .daily-streak can-spin-today tx-sender)
```

### Test NFT Contract

```bash
# Using Clarinet console
>>> (contract-call? .nft-collection mint u"Test NFT" u"ipfs://test")
>>> (contract-call? .nft-collection get-last-token-id)
>>> (contract-call? .nft-collection get-token-uri u1)
```

### Test from Frontend

```typescript
// Test wallet connection
const { connect, address } = useStacksWallet();
await connect();

// Test daily streak
const { spin } = useDailyStreakStacks();
const result = await spin();

// Test NFT mint
const { mintNFT } = useNFTMintStacks();
const tx = await mintNFT("My NFT", "ipfs://...");
```

---

## 💰 Deployment Costs

### Testnet (Free)
- Daily Streak: ~0 STX (testnet tokens)
- NFT Collection: ~0 STX (testnet tokens)

### Mainnet (Approximate)
- Contract Deployment: ~30-50 STX per contract
- Total: ~60-100 STX (~$30-$50 USD)
- Varies based on contract size and network congestion

---

## 🔍 Troubleshooting

### Issue: "Insufficient funds"
**Solution:** Add more STX to your wallet
```bash
# Check balance
clarinet wallet balance
```

### Issue: "Contract already exists"
**Solution:** Use a different deployer address or update contract

### Issue: "Syntax error in contract"
**Solution:** Run clarinet check and fix errors
```bash
clarinet check
```

### Issue: "Transaction failed"
**Solution:** Check network status and gas fees
- Visit: https://status.hiro.so/

---

## 📊 Monitoring Deployed Contracts

### Track Contract Activity

1. **Stacks Explorer**
   - Testnet: https://explorer.hiro.so/?chain=testnet
   - Mainnet: https://explorer.stacks.co

2. **Clarinet Dashboard**
```bash
clarinet devnet start
# Visit: http://localhost:8000
```

3. **Custom Monitoring**
```typescript
// Monitor transactions
import { StacksBlockchainApiClient } from '@stacks/blockchain-api-client';

const client = new StacksBlockchainApiClient({
  baseUrl: 'https://stacks-node-api.testnet.stacks.co',
});

// Get contract info
const info = await client.smartContractsApi.getContractById({
  contractId: 'ST1ABC...XYZ.daily-streak',
});
```

---

## 🎯 For Stacks Builder Challenges

### Submission Requirements

1. ✅ Contracts deployed to Stacks mainnet
2. ✅ Contract addresses publicly visible
3. ✅ Using Clarity 4 features
4. ✅ GitHub repository public
5. ✅ Integration with @stacks/connect
6. ✅ Using @stacks/transactions

### Verification

Share the following:
- Contract addresses (mainnet)
- Explorer links
- GitHub repository
- Deployed application URL

---

## 📚 Additional Resources

- [Clarinet Documentation](https://docs.hiro.so/clarinet)
- [Stacks Deployment Guide](https://docs.stacks.co/build-apps/guides/deploy-contract)
- [Clarity Language Reference](https://docs.stacks.co/clarity)
- [Stacks API Reference](https://docs.hiro.so/api)
- [Stacks Discord](https://discord.gg/stacks) - Get help from community

---

## 🔒 Security Best Practices

1. **Never commit private keys**
   - Add `.clarinet/` to `.gitignore`
   - Store secrets in environment variables

2. **Test thoroughly before mainnet**
   - Run all functions on testnet
   - Test edge cases
   - Verify with multiple wallets

3. **Audit contracts**
   - Review code for vulnerabilities
   - Get community feedback
   - Consider professional audit for high-value contracts

4. **Monitor after deployment**
   - Watch for unusual activity
   - Set up alerts for large transactions
   - Keep track of contract usage

---

**Last Updated:** December 2024
**Clarinet Version:** 2.x
**Stacks Network:** Nakamoto Release
