# Stacks Components Documentation

This directory contains React components for integrating with the Stacks blockchain.

## Components

### Leaderboard
Displays top players ranked by points and streak.

### StatsDashboard
Shows real-time blockchain statistics.

### TransactionHistory
Lists recent transactions for an address.

### WalletSwitcher
Allows users to select between different Stacks wallets.

### StacksErrorBoundary
Catches and displays errors gracefully.

### TransactionConfirmModal
Modal for confirming blockchain transactions.

## Usage

```tsx
import { Leaderboard } from '@/components/stacks/Leaderboard';

<Leaderboard limit={10} currentUserAddress={address} />
```
