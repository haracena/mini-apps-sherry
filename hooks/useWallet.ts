import { useAccount, useConnect, useDisconnect, useBalance, usePublicClient, useSwitchChain } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'
import { avalanche } from 'wagmi/chains'
import { formatEther } from 'viem'

interface WalletError {
  code?: string | number
  message: string
  details?: any
}

export function useWallet() {
  const { address, isConnected, isConnecting, isReconnecting, chain } = useAccount()
  const { disconnect } = useDisconnect()
  const { open } = useWeb3Modal()
  const { switchChain } = useSwitchChain()
  const publicClient = usePublicClient()

  const [error, setError] = useState<WalletError | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)
  const [previousAddress, setPreviousAddress] = useState<string | undefined>(undefined)

  // Fetch balance
  const { data: balanceData, isLoading: isLoadingBalance, refetch: refetchBalance } = useBalance({
    address,
    chainId: avalanche.id
  })

  // Detect account changes
  useEffect(() => {
    if (address && previousAddress && address !== previousAddress) {
      toast.info('Wallet Changed', {
        description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`
      })
    }
    setPreviousAddress(address)
  }, [address, previousAddress])

  // Detect when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      toast.success('Wallet Connected', {
        description: `${address.slice(0, 6)}...${address.slice(-4)}`
      })
    }
  }, [isConnected, address])

  // Check if on correct network
  const isCorrectNetwork = chain?.id === avalanche.id

  useEffect(() => {
    if (isConnected && !isCorrectNetwork && chain) {
      toast.warning('Wrong Network', {
        description: 'Please switch to Avalanche network',
        action: {
          label: 'Switch Network',
          onClick: () => handleSwitchNetwork()
        }
      })
    }
  }, [isConnected, isCorrectNetwork, chain])

  const handleSwitchNetwork = async () => {
    try {
      await switchChain({ chainId: avalanche.id })
      toast.success('Network Switched', {
        description: 'Connected to Avalanche'
      })
    } catch (error: any) {
      toast.error('Failed to Switch Network', {
        description: error.message || 'Please switch manually in your wallet'
      })
    }
  }

  const connect = async (retryCount = 0) => {
    const MAX_RETRIES = 2

    try {
      setError(null)
      setIsRetrying(retryCount > 0)
      await open()
    } catch (error: any) {
      const walletError: WalletError = {
        code: error.code,
        message: error.message || 'Failed to connect wallet',
        details: error
      }

      setError(walletError)

      // Retry logic for specific errors
      if (retryCount < MAX_RETRIES && (error.code === 4001 || error.message?.includes('rejected'))) {
        // User rejected, don't retry
        toast.error('Connection Rejected', {
          description: 'You rejected the connection request'
        })
      } else if (retryCount < MAX_RETRIES) {
        toast.error('Connection Failed', {
          description: 'Retrying...',
          duration: 2000
        })
        setTimeout(() => connect(retryCount + 1), 2000)
      } else {
        toast.error('Connection Failed', {
          description: walletError.message
        })
      }

      throw error
    } finally {
      setIsRetrying(false)
    }
  }

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect()
      setError(null)
      toast.info('Wallet Disconnected')
    } catch (error: any) {
      toast.error('Failed to Disconnect', {
        description: error.message
      })
    }
  }, [disconnect])

  // Estimate gas for a transaction
  const estimateGas = async (tx: any) => {
    if (!publicClient || !address) {
      throw new Error('Wallet not connected')
    }

    try {
      const gas = await publicClient.estimateGas({
        ...tx,
        account: address
      })
      return gas
    } catch (error: any) {
      throw new Error(`Gas estimation failed: ${error.message}`)
    }
  }

  // Check if user has enough balance for transaction
  const hasEnoughBalance = (requiredAmount: bigint) => {
    if (!balanceData) return false
    return balanceData.value >= requiredAmount
  }

  return {
    // Address & Connection
    address: address || null,
    connect,
    disconnect: handleDisconnect,
    connecting: isConnecting || isRetrying,
    isConnected,
    isReconnecting,

    // Network
    chain,
    isCorrectNetwork,
    switchToAvalanche: handleSwitchNetwork,

    // Balance
    balance: balanceData?.value || BigInt(0),
    balanceFormatted: balanceData ? formatEther(balanceData.value) : '0',
    isLoadingBalance,
    refetchBalance,

    // Error handling
    error,
    isRetrying,

    // Utilities
    estimateGas,
    hasEnoughBalance
  }
}