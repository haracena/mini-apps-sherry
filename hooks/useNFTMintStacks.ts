'use client';

import { useState, useCallback } from 'react';
import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  callReadOnlyFunction,
  cvToJSON,
  stringUtf8CV,
  stringAsciiCV,
  uintCV,
  standardPrincipalCV,
} from '@stacks/transactions';
import { useStacksWallet } from './useStacksWallet';
import { getContractAddress } from '@/config/stacks';

/**
 * NFT Mint Stacks Hook
 *
 * Interacts with nft-collection.clar contract using @stacks/transactions
 * Implements SIP-009 NFT minting on Stacks blockchain
 */

export function useNFTMintStacks() {
  const { address, isConnected, userSession, getNetwork } = useStacksWallet();
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Mint NFT with metadata
   */
  const mintNFT = useCallback(
    async (name: string, tokenUri: string) => {
      if (!isConnected || !address) {
        setError('Wallet not connected');
        return null;
      }

      try {
        setIsMinting(true);
        setError(null);

        const network = getNetwork();
        const contractAddress = getContractAddress('nftCollection');
        const [contractAddr, contractName] = contractAddress.split('.');

        const txOptions = {
          contractAddress: contractAddr,
          contractName: contractName,
          functionName: 'mint',
          functionArgs: [stringUtf8CV(name), stringAsciiCV(tokenUri)],
          senderKey: userSession.loadUserData().appPrivateKey,
          network,
          anchorMode: AnchorMode.Any,
          postConditionMode: PostConditionMode.Allow,
        };

        const transaction = await makeContractCall(txOptions);
        const result = await broadcastTransaction(transaction, network);

        setIsMinting(false);
        return result;
      } catch (err: any) {
        console.error('Mint error:', err);
        setError(err.message || 'Failed to mint NFT');
        setIsMinting(false);
        return null;
      }
    },
    [isConnected, address, userSession, getNetwork]
  );

  /**
   * Get token URI (read-only)
   */
  const getTokenURI = useCallback(
    async (tokenId: number) => {
      try {
        const network = getNetwork();
        const contractAddress = getContractAddress('nftCollection');
        const [contractAddr, contractName] = contractAddress.split('.');

        const result = await callReadOnlyFunction({
          contractAddress: contractAddr,
          contractName: contractName,
          functionName: 'get-token-uri',
          functionArgs: [uintCV(tokenId)],
          network,
          senderAddress: address || contractAddr,
        });

        return cvToJSON(result);
      } catch (err) {
        console.error('Get token URI error:', err);
        return null;
      }
    },
    [address, getNetwork]
  );

  /**
   * Get token owner (read-only)
   */
  const getOwner = useCallback(
    async (tokenId: number) => {
      try {
        const network = getNetwork();
        const contractAddress = getContractAddress('nftCollection');
        const [contractAddr, contractName] = contractAddress.split('.');

        const result = await callReadOnlyFunction({
          contractAddress: contractAddr,
          contractName: contractName,
          functionName: 'get-owner',
          functionArgs: [uintCV(tokenId)],
          network,
          senderAddress: address || contractAddr,
        });

        return cvToJSON(result);
      } catch (err) {
        console.error('Get owner error:', err);
        return null;
      }
    },
    [address, getNetwork]
  );

  /**
   * Get last token ID (read-only)
   */
  const getLastTokenId = useCallback(async () => {
    try {
      const network = getNetwork();
      const contractAddress = getContractAddress('nftCollection');
      const [contractAddr, contractName] = contractAddress.split('.');

      const result = await callReadOnlyFunction({
        contractAddress: contractAddr,
        contractName: contractName,
        functionName: 'get-last-token-id',
        functionArgs: [],
        network,
        senderAddress: address || contractAddr,
      });

      return cvToJSON(result);
    } catch (err) {
      console.error('Get last token ID error:', err);
      return null;
    }
  }, [address, getNetwork]);

  /**
   * Get token metadata (read-only)
   */
  const getTokenMetadata = useCallback(
    async (tokenId: number) => {
      try {
        const network = getNetwork();
        const contractAddress = getContractAddress('nftCollection');
        const [contractAddr, contractName] = contractAddress.split('.');

        const result = await callReadOnlyFunction({
          contractAddress: contractAddr,
          contractName: contractName,
          functionName: 'get-token-metadata',
          functionArgs: [uintCV(tokenId)],
          network,
          senderAddress: address || contractAddr,
        });

        return cvToJSON(result);
      } catch (err) {
        console.error('Get token metadata error:', err);
        return null;
      }
    },
    [address, getNetwork]
  );

  /**
   * Get mint price as string (Clarity 4 feature - read-only)
   */
  const getMintPriceString = useCallback(async () => {
    try {
      const network = getNetwork();
      const contractAddress = getContractAddress('nftCollection');
      const [contractAddr, contractName] = contractAddress.split('.');

      const result = await callReadOnlyFunction({
        contractAddress: contractAddr,
        contractName: contractName,
        functionName: 'get-mint-price-string',
        functionArgs: [],
        network,
        senderAddress: address || contractAddr,
      });

      return cvToJSON(result);
    } catch (err) {
      console.error('Get mint price error:', err);
      return null;
    }
  }, [address, getNetwork]);

  return {
    mintNFT,
    getTokenURI,
    getOwner,
    getLastTokenId,
    getTokenMetadata,
    getMintPriceString,
    isMinting,
    error,
    isConnected,
  };
}
