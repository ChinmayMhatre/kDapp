import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, goerli } from 'wagmi/chains'
import { coinbaseWallet, injected} from 'wagmi/connectors'

export const config = createConfig({
  chains: [mainnet, sepolia, goerli],
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'Create Wagmi' }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [goerli.id]: http(),
  },
   
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
