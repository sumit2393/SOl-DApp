export const NETWORKS = {
  devnet: {
    name: 'Devnet',
    rpcUrl: 'https://api.devnet.solana.com',
    color: '#14F195',
  },
  testnet: {
    name: 'Testnet',
    rpcUrl: 'https://api.testnet.solana.com',
    color: '#FFB800',
  },
  mainnet: {
    name: 'Mainnet',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    color: '#9945FF',
  },
};

export type NetworkType = keyof typeof NETWORKS;