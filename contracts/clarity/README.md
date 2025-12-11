# Clarity Smart Contracts

This directory contains Clarity smart contracts for deployment on the Stacks blockchain.

## 📋 Contracts Overview

### 1. `daily-streak.clar`

Daily spin wheel game with streak tracking implemented in Clarity.

**Features:**
- Once-per-day spin mechanism
- Points reward system (10-150 points)
- Consecutive day streak tracking
- Automatic streak reset on missed days

**Public Functions:**
- `(spin)` - Spin the wheel for daily points
  - Returns: `{prize: uint, streak: uint, total-points: uint}`
  - Error: `u101` if already spun today

**Read-Only Functions:**
- `(get-player-info (player principal))` - Get player data
- `(get-points-as-string (player principal))` - Points as formatted string
- `(get-streak (player principal))` - Current streak count
- `(can-spin-today (player principal))` - Check if player can spin
- `(get-total-points-distributed)` - Global points distributed

**Clarity 4 Features Used:**
- ✅ `to-consensus-buff?` - Enhanced randomness generation
- ✅ `buff-to-uint-le` - Buffer to unsigned integer conversion
- ✅ `uint-to-string` - Format numbers as strings for display

---

### 2. `nft-collection.clar`

SIP-009 compliant NFT collection with metadata storage.

**Features:**
- ERC721-equivalent NFT standard (SIP-009)
- On-chain metadata storage
- Configurable mint price in STX
- Transfer functionality
- Owner-only administrative functions

**Public Functions:**
- `(mint (name (string-utf8 64)) (uri (string-ascii 256)))` - Mint new NFT
  - Requires payment in STX
  - Returns: token ID
- `(transfer (token-id uint) (sender principal) (recipient principal))` - Transfer NFT
- `(set-mint-price (new-price uint))` - Update mint price (owner only)
- `(withdraw (amount uint) (recipient principal))` - Withdraw STX (owner only)

**Read-Only Functions:**
- `(get-last-token-id)` - Get total minted count
- `(get-token-uri (token-id uint))` - Get token URI
- `(get-owner (token-id uint))` - Get token owner
- `(get-token-metadata (token-id uint))` - Get full metadata
- `(get-token-id-string (token-id uint))` - Token ID as string
- `(get-mint-price-string)` - Mint price as formatted string
- `(get-creation-time-string (token-id uint))` - Creation timestamp as string

**Clarity 4 Features Used:**
- ✅ `uint-to-string` - Convert token IDs and prices to strings
- ✅ `block-height` - Timestamp for NFT creation tracking

---

## 🚀 Deployment Guide

### Prerequisites

1. Install Clarinet CLI:
```bash
npm install -g @hirosystems/clarinet
```

2. Initialize Clarinet project:
```bash
clarinet integrate
```

### Deploy to Testnet

1. Configure your wallet in Clarinet:
```bash
clarinet wallet new
```

2. Check contract syntax:
```bash
clarinet check
```

3. Deploy contracts:
```bash
clarinet deploy --testnet
```

### Deploy to Mainnet

1. Review contract code carefully
2. Test thoroughly on testnet
3. Deploy to mainnet:
```bash
clarinet deploy --mainnet
```

4. Update contract addresses in:
   - `config/stacks.ts`
   - `.env` file

---

## 🧪 Testing

Run contract tests:
```bash
clarinet test
```

Interactive console:
```bash
clarinet console
```

Example console commands:
```clarity
;; Spin the wheel
(contract-call? .daily-streak spin)

;; Get player info
(contract-call? .daily-streak get-player-info tx-sender)

;; Mint NFT
(contract-call? .nft-collection mint u"My NFT" u"ipfs://Qm...")
```

---

## 📊 Contract Interactions

### Frontend Integration

Use the provided React hooks:

```typescript
// Daily Streak
import { useDailyStreakStacks } from '@/hooks/useDailyStreakStacks';
const { spin, getPlayerInfo, canSpinToday } = useDailyStreakStacks();

// NFT Minting
import { useNFTMintStacks } from '@/hooks/useNFTMintStacks';
const { mintNFT, getTokenURI, getLastTokenId } = useNFTMintStacks();
```

---

## 📚 Resources

- [Clarity Language Docs](https://docs.stacks.co/clarity)
- [Clarity 4 Features](https://docs.stacks.co/whats-new/clarity-4-is-now-live)
- [SIP-009 NFT Standard](https://github.com/stacksgov/sips/blob/main/sips/sip-009/sip-009-nft-standard.md)
- [Clarinet Documentation](https://docs.hiro.so/clarinet)
- [Stacks Explorer - Testnet](https://explorer.hiro.so/?chain=testnet)
- [Stacks Explorer - Mainnet](https://explorer.stacks.co)

---

## 🔒 Security Considerations

- ✅ Reentrancy protection not needed in Clarity (built-in)
- ✅ Integer overflow/underflow prevention (Clarity built-in)
- ✅ Access control via `tx-sender` checks
- ✅ Owner-only functions protected
- ⚠️ Randomness uses block data (suitable for low-stakes games)

---

## 📝 License

MIT License - See main repository LICENSE file
