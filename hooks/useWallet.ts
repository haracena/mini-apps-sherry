import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'

export function useWallet() {
  const { address, isConnected, isConnecting } = useAccount()
  const { disconnect } = useDisconnect()
  const { open } = useWeb3Modal()

  const connect = async () => {
    try {
      await open()
    } catch (error) {
      console.error('Error connecting wallet:', error)
      throw error
    }
  }

  return {
    address: address || null,
    connect,
    disconnect,
    connecting: isConnecting,
    isConnected,
    error: null
  }
}