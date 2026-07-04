import * as SecureStorage from 'expo-secure-store';
import { CONFIG } from '../constants/config';

export async function saveToSecureStorage(
    secretKey: string, publicKey: string

): Promise<void> {
  try {
    await SecureStorage.setItemAsync(CONFIG.WALLET_SECRET_KEY, secretKey);
    await SecureStorage.setItemAsync(CONFIG.WALLET_PUBLIC_KEY, publicKey);
  } catch (error) {
    console.error(`Error saving to secure storage: ${error}`);
  }
}

export async function getSecretKey(): Promise<string | null> {
  return await SecureStorage.getItemAsync(CONFIG.WALLET_SECRET_KEY);
}

export async function getPublicKey(): Promise<string | null> {
  return await SecureStorage.getItemAsync(CONFIG.WALLET_PUBLIC_KEY);
}
export async function clearWallet(): Promise<void> {
  await SecureStorage.deleteItemAsync(CONFIG.WALLET_SECRET_KEY);
  await SecureStorage.deleteItemAsync(CONFIG.WALLET_PUBLIC_KEY);
}

export async function walletExist():Promise<boolean>{
const key = await getPublicKey();
return !!key;
}
