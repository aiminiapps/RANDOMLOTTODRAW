'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { WagmiProvider } from 'wagmi'
import { config, projectId, chains } from '../lib/wagmi'
import { TonConnectUIProvider } from '@tonconnect/ui-react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, cacheTime: 10 * 60 * 1000 }
  }
})

if (typeof window !== 'undefined' && !window.__WEB3MODAL_INITIALIZED__) {
  createWeb3Modal({
    wagmiConfig: config,
    projectId,
    chains,
    enableAnalytics: true,
    enableOnramp: true,
    enableSwaps: true,
    themeMode: 'dark',
    themeVariables: {
      '--w3m-z-index': 99999,
      '--w3m-accent': '#00FFAA'
    }
  })
  window.__WEB3MODAL_INITIALIZED__ = true
}

export default function Web3Provider({ children, initialState }) {
  return (
    <TonConnectUIProvider manifestUrl="https://randomlottodraw.vercel.app/tonconnect-manifest.json">
      <WagmiProvider config={config} initialState={initialState}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </TonConnectUIProvider>
  )
}
