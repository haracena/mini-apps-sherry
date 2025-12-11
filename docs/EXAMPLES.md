# Stacks Integration Examples

Practical code examples for using Stacks contracts in your application.

## 🎮 Daily Streak Contract

### Connect Wallet and Spin

```typescript
import { useStacksWallet } from '@/hooks/useStacksWallet';
import { useDailyStreakStacks } from '@/hooks/useDailyStreakStacks';

function DailyStreakExample() {
  const { address, isConnected, connect } = useStacksWallet();
  const { spin, getPlayerInfo, canSpinToday, isSpinning } = useDailyStreakStacks();

  const handleSpin = async () => {
    if (!isConnected) {
      await connect();
      return;
    }

    // Check if can spin today
    const canSpin = await canSpinToday();
    if (!canSpin) {
      alert('You already spun today!');
      return;
    }

    // Spin the wheel
    const result = await spin();
    if (result) {
      console.log('Spin successful!', result);
    }
  };

  return (
    <button onClick={handleSpin} disabled={isSpinning}>
      {isSpinning ? 'Spinning...' : 'Spin Daily Wheel'}
    </button>
  );
}
```

### Get Player Stats

```typescript
const { getPlayerInfo, getStreak } = useDailyStreakStacks();

// Get full player data
const playerData = await getPlayerInfo(address);
console.log('Points:', playerData.points);
console.log('Streak:', playerData['current-streak']);
console.log('Total Spins:', playerData['total-spins']);

// Get just the streak
const streak = await getStreak(address);
console.log('Current Streak:', streak);
```

## 🖼️ NFT Collection Contract

### Mint NFT

```typescript
import { useNFTMintStacks } from '@/hooks/useNFTMintStacks';

function MintNFTExample() {
  const { mintNFT, isMinting, error } = useNFTMintStacks();

  const handleMint = async () => {
    const name = 'My Awesome NFT';
    const uri = 'ipfs://Qm...'; // Your IPFS URI

    const txId = await mintNFT(name, uri);

    if (txId) {
      console.log('NFT minted! Transaction:', txId);
    }
  };

  return (
    <div>
      <button onClick={handleMint} disabled={isMinting}>
        {isMinting ? 'Minting...' : 'Mint NFT'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
```

### Query NFT Data

```typescript
const { getTokenURI, getOwner, getLastTokenId, getTokenMetadata } = useNFTMintStacks();

// Get total NFTs minted
const lastId = await getLastTokenId();
console.log('Total NFTs:', lastId);

// Get NFT owner
const owner = await getOwner(tokenId);
console.log('Owner:', owner);

// Get token URI
const uri = await getTokenURI(tokenId);
console.log('Token URI:', uri);

// Get full metadata
const metadata = await getTokenMetadata(tokenId);
console.log('Name:', metadata.name);
console.log('URI:', metadata.uri);
console.log('Created at block:', metadata['created-at']);
```

## 🔧 Using Context Provider

```typescript
import { StacksProvider, useStacks } from '@/contexts/StacksProvider';

// Wrap your app
function App() {
  return (
    <StacksProvider>
      <YourComponents />
    </StacksProvider>
  );
}

// Access in any component
function MyComponent() {
  const { wallet, dailyStreak, nftMint } = useStacks();

  return (
    <div>
      {wallet.isConnected && (
        <p>Connected: {wallet.address}</p>
      )}
      <button onClick={dailyStreak.spin}>Spin</button>
      <button onClick={() => nftMint.mintNFT('Name', 'URI')}>
        Mint NFT
      </button>
    </div>
  );
}
```

## 📊 Display Components

### Show Balance

```typescript
import { StacksBalance } from '@/components/StacksBalance';

function WalletInfo({ address }: { address: string }) {
  return (
    <div>
      <h3>Your Balance</h3>
      <StacksBalance
        address={address}
        network="testnet"
        showSymbol={true}
      />
    </div>
  );
}
```

### Track Transaction

```typescript
import { StacksTransactionStatus } from '@/components/StacksTransactionStatus';

function TransactionTracker({ txId }: { txId: string }) {
  return (
    <StacksTransactionStatus
      txId={txId}
      network="testnet"
      onSuccess={() => alert('Transaction confirmed!')}
      onError={() => alert('Transaction failed!')}
    />
  );
}
```

### Network Status

```typescript
import { StacksNetworkStatus } from '@/components/StacksNetworkStatus';

function Header() {
  return (
    <header>
      <StacksNetworkStatus network="testnet" />
    </header>
  );
}
```

## 🔌 Wallet Connection

### Basic Connection

```typescript
import { StacksWalletButton } from '@/components/StacksWalletButton';

function ConnectSection() {
  return <StacksWalletButton />;
}
```

### Manual Connection

```typescript
import { useStacksWallet } from '@/hooks/useStacksWallet';

function ManualConnect() {
  const { connect, disconnect, isConnected, address } = useStacksWallet();

  return (
    <div>
      {!isConnected ? (
        <button onClick={connect}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected: {address}</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      )}
    </div>
  );
}
```

## 🛠️ Utility Functions

### Format STX Amounts

```typescript
import { formatStx, microStxToStx, stxToMicroStx } from '@/lib/stacks-utils';

// Convert and format
const formatted = formatStx(1000000); // "1.00 STX"

// Convert microSTX to STX
const stx = microStxToStx(5000000); // 5

// Convert STX to microSTX
const microStx = stxToMicroStx(2.5); // 2500000
```

### Validate Addresses

```typescript
import { isValidStacksAddress, shortenAddress } from '@/lib/stacks-utils';

// Validate
const isValid = isValidStacksAddress('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');
// true

// Shorten for display
const short = shortenAddress('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');
// "ST1P...ZGZGM"
```

### Explorer Links

```typescript
import { getTxExplorerUrl, getAddressExplorerUrl } from '@/lib/stacks-utils';

// Transaction link
const txUrl = getTxExplorerUrl(txId, 'testnet');

// Address link
const addressUrl = getAddressExplorerUrl(address, 'testnet');

// Open in new tab
window.open(txUrl, '_blank');
```

### Wait for Confirmation

```typescript
import { waitForTransaction } from '@/lib/stacks-utils';

async function mintAndWait() {
  const { mintNFT } = useNFTMintStacks();

  // Mint NFT
  const txId = await mintNFT('Name', 'URI');

  if (txId) {
    // Wait for confirmation (max 30 attempts = ~1 minute)
    const confirmed = await waitForTransaction(txId, 'testnet', 30);

    if (confirmed) {
      console.log('Transaction confirmed!');
    } else {
      console.log('Transaction failed or timed out');
    }
  }
}
```

## 🌐 Multi-Chain Support

### Network Selector

```typescript
import { NetworkSelector, useNetworkSelector } from '@/components/NetworkSelector';

function MultiChainApp() {
  const { network, setNetwork, isStacks } = useNetworkSelector();

  return (
    <div>
      <NetworkSelector
        currentNetwork={network}
        onNetworkChange={setNetwork}
      />

      {isStacks ? (
        <StacksFeatures />
      ) : (
        <AvalancheFeatures />
      )}
    </div>
  );
}
```

## 🎯 Complete Example

```typescript
'use client';

import { useState } from 'react';
import { useStacksWallet } from '@/hooks/useStacksWallet';
import { useDailyStreakStacks } from '@/hooks/useDailyStreakStacks';
import { StacksWalletButton } from '@/components/StacksWalletButton';
import { StacksBalance } from '@/components/StacksBalance';
import { StacksTransactionStatus } from '@/components/StacksTransactionStatus';

export default function DailyStreakPage() {
  const { address, isConnected } = useStacksWallet();
  const { spin, getPlayerInfo, canSpinToday, isSpinning } = useDailyStreakStacks();
  const [txId, setTxId] = useState<string | null>(null);
  const [playerData, setPlayerData] = useState<any>(null);

  const handleSpin = async () => {
    if (!isConnected) return;

    const canSpin = await canSpinToday();
    if (!canSpin) {
      alert('Come back tomorrow!');
      return;
    }

    const result = await spin();
    if (result.txId) {
      setTxId(result.txId);
      // Refresh player data
      const data = await getPlayerInfo();
      setPlayerData(data);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Daily Streak</h1>

      {/* Wallet Connection */}
      <div className="mb-8">
        <StacksWalletButton />
      </div>

      {/* Balance Display */}
      {isConnected && address && (
        <div className="mb-8">
          <StacksBalance address={address} network="testnet" />
        </div>
      )}

      {/* Player Stats */}
      {playerData && (
        <div className="mb-8 p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Your Stats</h2>
          <p>Points: {playerData.points}</p>
          <p>Streak: {playerData['current-streak']} days</p>
          <p>Total Spins: {playerData['total-spins']}</p>
        </div>
      )}

      {/* Spin Button */}
      <button
        onClick={handleSpin}
        disabled={!isConnected || isSpinning}
        className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg disabled:opacity-50"
      >
        {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
      </button>

      {/* Transaction Status */}
      {txId && (
        <div className="mt-8">
          <StacksTransactionStatus
            txId={txId}
            network="testnet"
            onSuccess={() => alert('Spin confirmed!')}
          />
        </div>
      )}
    </div>
  );
}
```

---

For more examples, see the [Stacks Documentation](https://docs.stacks.co) and [Clarity 4 Guide](./CLARITY4_FEATURES.md).
