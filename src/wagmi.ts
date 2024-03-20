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
    [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/9uYuE_B8KltENwqjoeUwH_Ic-PDGASjI'),
    [goerli.id]: http('https://eth-goerli.g.alchemy.com/v2/9uYuE_B8KltENwqjoeUwH_Ic-PDGASjI'),
  },
   
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
