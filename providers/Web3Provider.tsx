'use client'

import { ReactNode, useMemo } from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config, projectId } from '@/config/wagmi'
import { createWeb3Modal } from '@web3modal/wagmi/react'

// Configuración optimizada de QueryClient con persistencia y retry logic
const queryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minuto
      gcTime: 5 * 60 * 1000, // 5 minutos (anteriormente cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true
    },
    mutations: {
      retry: 1
    }
  }
}

// Singleton QueryClient
let queryClientInstance: QueryClient | null = null

function getQueryClient() {
  if (!queryClientInstance) {
    queryClientInstance = new QueryClient(queryClientConfig)
  }
  return queryClientInstance
}

// Singleton Web3Modal
let web3ModalInitialized = false

function initWeb3Modal() {
  if (!web3ModalInitialized) {
    createWeb3Modal({
      wagmiConfig: config,
      projectId,
      enableAnalytics: true,
      enableOnramp: true,
      themeMode: 'dark',
      themeVariables: {
        '--w3m-accent': '#3b82f6',
        '--w3m-border-radius-master': '8px'
      },
      featuredWalletIds: [
        'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
        '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', // Trust Wallet
        '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369', // Rainbow
      ]
    })
    web3ModalInitialized = true
  }
}

export function Web3Provider({ children }: { children: ReactNode }) {
  // Inicializar Web3Modal de forma lazy
  if (typeof window !== 'undefined') {
    initWeb3Modal()
  }

  // Memoizar QueryClient
  const queryClient = useMemo(() => getQueryClient(), [])

  return (
    <WagmiProvider config={config} reconnectOnMount={true}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}