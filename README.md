# Social Triggers - Multi-Chain Mini Apps Platform

A comprehensive Web3 mini-apps platform featuring daily streak games, NFT minting, and Telegram integration across **Avalanche** and **Stacks** blockchains.

## 🎯 Features

### 🎮 Daily Streak Game
- Spin wheel for daily points (10-150 range)
- Consecutive day streak tracking
- Automatic streak reset detection
- Prize distribution with tiered probabilities

### 🖼️ NFT Collection
- Mint custom NFTs with metadata
- SIP-009 (Stacks) and ERC721 (Avalanche) compliant
- IPFS storage via Pinata
- NFT gallery with search and filter
- Analytics dashboard

### 🌐 Multi-Chain Support
- **Avalanche C-Chain** - EVM-compatible contracts
- **Stacks Bitcoin L2** - Clarity smart contracts
- Seamless network switching
- Unified user experience

### 📱 Telegram Integration
- Telegram authentication
- Monetized group invitations
- Smart contract escrow system

## 🚀 Tech Stack

### Frontend
- **Next.js 15** with App Router
- **React 19** with Turbopack
- **TypeScript** for type safety
- **TailwindCSS v4** for styling
- **Radix UI** components

### Blockchain
- **@stacks/connect** - Stacks wallet integration
- **@stacks/transactions** - Clarity contract interactions
- **Wagmi v2** - EVM wallet management
- **Viem v2** - Ethereum utilities
- **Web3Modal** - Multi-wallet support

### Storage & Backend
- **Pinata** - IPFS for NFT metadata
- **Supabase** - PostgreSQL database
- **Resend** - Email notifications

## 📋 Stacks Builder Challenges

This project participates in **Stacks Builder Challenges Week 1** (Dec 10-14, 2024).

### Clarity 4 Features Used ✅

- `to-consensus-buff?` - Enhanced randomness generation
- `buff-to-uint-le` - Buffer to integer conversion
- `uint-to-string` - Number formatting for display

**Details:** See [docs/CLARITY4_FEATURES.md](./docs/CLARITY4_FEATURES.md)

### Smart Contracts

**Stacks Clarity Contracts:**
- `contracts/clarity/daily-streak.clar` - Daily spin wheel game
- `contracts/clarity/nft-collection.clar` - SIP-009 NFT standard

**Avalanche Solidity Contracts:**
- `contracts/solidity/DailyStreak.sol` - EVM daily streak
- `contracts/solidity/MintableNFT.sol` - ERC721 NFT
- `contracts/solidity/TelegramGroupInvitations.sol` - Telegram integration

## 🛠️ Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Setup

1. **Clone repository:**
```bash
git clone https://github.com/yourusername/mini-apps-sherry.git
cd mini-apps-sherry
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your API keys
```

4. **Run development server:**
```bash
npm run dev
```

5. **Open browser:**
```
http://localhost:3000
```

## 🌐 Deployment

### Deploy Stacks Contracts

See detailed guide: [docs/STACKS_DEPLOYMENT.md](./docs/STACKS_DEPLOYMENT.md)

```bash
# Install Clarinet
npm install -g @hirosystems/clarinet

# Deploy to testnet
clarinet deploy --testnet

# Deploy to mainnet
clarinet deploy --mainnet
```

### Deploy Frontend

**Vercel (Recommended):**
```bash
vercel
```

**Or manual build:**
```bash
npm run build
npm start
```

## 📚 Documentation

- [Clarity Contracts README](./contracts/clarity/README.md) - Contract documentation
- [Clarity 4 Features](./docs/CLARITY4_FEATURES.md) - Week 1 bonus features
- [Stacks Deployment Guide](./docs/STACKS_DEPLOYMENT.md) - Deployment instructions

## 🔗 Links

### Stacks Resources
- [Stacks Documentation](https://docs.stacks.co)
- [Clarity 4 Release](https://docs.stacks.co/whats-new/clarity-4-is-now-live)
- [SIP-009 NFT Standard](https://github.com/stacksgov/sips/blob/main/sips/sip-009/sip-009-nft-standard.md)
- [Stacks Explorer - Testnet](https://explorer.hiro.so/?chain=testnet)

### Supported Wallets
- [Leather](https://leather.io/) - Stacks
- [Xverse](https://xverse.app/) - Stacks
- [MetaMask](https://metamask.io/) - Avalanche
- [WalletConnect](https://walletconnect.com/) - Multi-chain

## 🏗️ Project Structure

```
mini-apps-sherry/
├── app/                    # Next.js pages
├── components/             # React components
│   ├── NetworkSelector.tsx      # Chain switcher
│   └── StacksWalletButton.tsx   # Stacks wallet
├── contracts/
│   ├── clarity/           # Stacks contracts
│   │   ├── daily-streak.clar
│   │   └── nft-collection.clar
│   └── solidity/          # Avalanche contracts
├── hooks/                 # React hooks
│   ├── useStacksWallet.ts       # Stacks connection
│   ├── useDailyStreakStacks.ts  # Streak interactions
│   └── useNFTMintStacks.ts      # NFT minting
├── config/
│   ├── stacks.ts          # Stacks configuration
│   └── wagmi.ts           # Avalanche configuration
├── types/
│   └── stacks.ts          # TypeScript definitions
└── docs/
    ├── CLARITY4_FEATURES.md
    └── STACKS_DEPLOYMENT.md
```

## 🎮 Usage

### Connect Wallet

**Stacks:**
```typescript
import { useStacksWallet } from '@/hooks/useStacksWallet';

const { connect, address } = useStacksWallet();
await connect();
```

**Avalanche:**
```typescript
import { useAccount, useConnect } from 'wagmi';

const { connect } = useConnect();
await connect();
```

### Interact with Contracts

**Daily Streak:**
```typescript
import { useDailyStreakStacks } from '@/hooks/useDailyStreakStacks';

const { spin, getPlayerInfo } = useDailyStreakStacks();
const result = await spin();
```

**Mint NFT:**
```typescript
import { useNFTMintStacks } from '@/hooks/useNFTMintStacks';

const { mintNFT } = useNFTMintStacks();
const tx = await mintNFT("NFT Name", "ipfs://...");
```

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 🙏 Acknowledgments

- **Stacks Foundation** - Stacks Builder Challenges
- **Talent Protocol** - Challenge platform
- **Hiro** - Clarinet and development tools
- **Avalanche** - EVM infrastructure

## 📞 Support

- GitHub Issues: [Create Issue](https://github.com/yourusername/mini-apps-sherry/issues)
- Stacks Discord: [Join Community](https://discord.gg/stacks)
- Twitter: [@yourhandle](https://twitter.com/yourhandle)

---

**Built for Stacks Builder Challenges** | Dec 2024
