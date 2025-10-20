import { cookieStorage, createStorage } from 'wagmi'
import { avalanche } from 'wagmi/chains'
import { http, createConfig } from 'wagmi'
import { walletConnect, injected, coinbaseWallet } from 'wagmi/connectors'

// Obtén tu projectId de https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!

if (!projectId) {
  throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set')
}

const metadata = {
  name: 'Telegram Group Invitation',
  description: 'Manage your Telegram group invitations with crypto',
  url: typeof window !== 'undefined' ? window.location.origin : '',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

export const config = createConfig({
  chains: [avalanche],
  connectors: [
    walletConnect({ 
      projectId, 
      metadata,
      showQrModal: true 
    }),
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      appName: metadata.name,
      appLogoUrl: metadata.icons[0]
    })
  ],
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  transports: {
    [avalanche.id]: http()
  }
})