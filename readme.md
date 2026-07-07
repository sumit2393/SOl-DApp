# Solana Wallet

A production-grade Solana wallet built with React Native + Expo.

## Features

### Phase 1 — Core ✅
- Generate 12-word mnemonic seed phrase
- Derive Solana keypair (ed25519)
- Secure storage (expo-secure-store)
- Import existing wallet via seed phrase

### Phase 2 — Security ✅
- Biometric authentication (Face ID / Fingerprint)
- Auto-lock on app background
- Seed phrase backup & verification

### Phase 3 — Network & Balance ✅
- Devnet / Testnet / Mainnet support
- Real-time SOL balance
- Pull-to-refresh
- Devnet airdrop

### Phase 4 — Transactions ✅
- Send SOL
- Receive SOL (QR code)
- Transaction history
- Copy/Share address

### Phase 5 — Market ✅
- Real-time BTC, ETH, SOL prices
- 24h price change
- CoinGecko API integration

## Tech Stack

| Category | Library |
|----------|---------|
| Framework | React Native + Expo |
| Navigation | Expo Router |
| State Management | Zustand |
| Blockchain | @solana/web3.js |
| Wallet Crypto | bip39 + ed25519-hd-key |
| Secure Storage | expo-secure-store |
| Biometric | expo-local-authentication |
| QR Code | react-native-qrcode-svg |
| Price API | CoinGecko |

## Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- Android Studio / Xcode

### Installation

```bash
# Clone karo
git clone https://github.com/yourusername/SolanaWallet.git
cd SolanaWallet

# Install dependencies
npm install --legacy-peer-deps

# Environment setup
cp .env.example .env
# .env mein EXPO_PUBLIC_HELIUS_API_KEY add karo

# Run karo
npx expo run:android
# ya
npx expo run:ios
```

### Environment Variables

Get free API key from: https://dev.helius.xyz

## Roadmap

### Phase 6 — SPL Tokens
- [ ] Token list
- [ ] Token transfer
- [ ] Token balance

### Phase 7 — NFTs
- [ ] NFT collection display
- [ ] NFT transfer
- [ ] Metaplex integration

### Phase 8 — Swap
- [ ] Jupiter aggregator
- [ ] Token swap
- [ ] Slippage settings

### Phase 9 — DeFi
- [ ] Staking
- [ ] Validator list
- [ ] Rewards tracking

### Phase 10 — dApp Browser
- [ ] Mobile Wallet Adapter
- [ ] WalletConnect
- [ ] In-app browser

## Security

- Private keys never leave device
- Encrypted with expo-secure-store
- Biometric authentication
- No backend — fully decentralized

## License

MIT