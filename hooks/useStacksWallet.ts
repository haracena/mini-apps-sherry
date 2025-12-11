'use client';

import { useState, useEffect, useCallback } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { STACKS_APP_CONFIG, DEFAULT_STACKS_NETWORK } from '@/config/stacks';

/**
 * Stacks Wallet Hook
 *
 * Manages Stacks wallet connection using @stacks/connect
 * Supports Leather, Xverse, and other Stacks wallets
 */

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

interface StacksWalletState {
  address: string | null;
  isConnected: boolean;
  isLoading: boolean;
  userData: any;
  network: 'mainnet' | 'testnet';
}

export function useStacksWallet() {
  const [state, setState] = useState<StacksWalletState>({
    address: null,
    isConnected: false,
    isLoading: true,
    userData: null,
    network: DEFAULT_STACKS_NETWORK,
  });

  // Check if user is already signed in
  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      const address = userData.profile.stxAddress[DEFAULT_STACKS_NETWORK];

      setState({
        address,
        isConnected: true,
        isLoading: false,
        userData,
        network: DEFAULT_STACKS_NETWORK,
      });
    } else if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        const address = userData.profile.stxAddress[DEFAULT_STACKS_NETWORK];
        setState({
          address,
          isConnected: true,
          isLoading: false,
          userData,
          network: DEFAULT_STACKS_NETWORK,
        });
      });
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Connect wallet function
  const connect = useCallback(() => {
    showConnect({
      appDetails: {
        name: STACKS_APP_CONFIG.name,
        icon: window.location.origin + STACKS_APP_CONFIG.icon,
      },
      onFinish: () => {
        if (userSession.isUserSignedIn()) {
          const userData = userSession.loadUserData();
          const address = userData.profile.stxAddress[DEFAULT_STACKS_NETWORK];

          setState({
            address,
            isConnected: true,
            isLoading: false,
            userData,
            network: DEFAULT_STACKS_NETWORK,
          });
        }
      },
      onCancel: () => {
        console.log('User cancelled wallet connection');
      },
      userSession,
    });
  }, []);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    userSession.signUserOut();
    setState({
      address: null,
      isConnected: false,
      isLoading: false,
      userData: null,
      network: DEFAULT_STACKS_NETWORK,
    });
  }, []);

  // Get network object for transactions
  const getNetwork = useCallback(() => {
    return state.network === 'mainnet'
      ? new StacksMainnet()
      : new StacksTestnet();
  }, [state.network]);

  return {
    address: state.address,
    isConnected: state.isConnected,
    isLoading: state.isLoading,
    userData: state.userData,
    network: state.network,
    connect,
    disconnect,
    getNetwork,
    userSession,
  };
}
