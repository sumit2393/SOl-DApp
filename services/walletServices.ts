import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import { Keypair } from '@solana/web3.js';
import { Buffer as BufferPolyfill } from 'buffer';
import { WalletData } from '../models/wallet';

//new wallet genrate 
export function generateWallet(): WalletData {
  const mnemonic = bip39.generateMnemonic(128); // 12 words
  return mnemonicToWallet(mnemonic);
}

// Derive wallet data from mnemonic
export function mnemonicToWallet(mnemonic: string): WalletData {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const derivationPath = "m/44'/501'/0'/0'"; // Solana standard
  const derivedSeed = derivePath(
    derivationPath,
    seed.toString('hex')
  ).key;
  const keypair = Keypair.fromSeed(derivedSeed);

  return {
    mnemonic,
    publicKey: keypair.publicKey.toBase58(),
    secretKey: BufferPolyfill.from(keypair.secretKey).toString('base64'),
  };
}

//validate mnemonic
export function isValidMnemonic(mnemonic: string): boolean {
  return bip39.validateMnemonic(mnemonic.trim().toLowerCase());
}

// base64 to keypair and Transaction signing
export function getKeypairFromSecret(secretKeyBase64: string): Keypair {
  const secretKey = BufferPolyfill.from(secretKeyBase64, 'base64');
  return Keypair.fromSecretKey(secretKey);
}