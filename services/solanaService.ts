import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import { NETWORKS, NetworkType } from '../constants/network';
import { getKeypairFromSecret } from './walletServices';
import { Transaction as TxModel } from '../models/transaction';

// Create a connection to the Solana network based on the selected network type
export function getConnection(network: NetworkType): Connection {
  return new Connection(NETWORKS[network].rpcUrl, 'confirmed');
}

// Fetch SOL balance for a given public key and network
export async function getBalance(
  publicKey: string,
  network: NetworkType
): Promise<number> {
    try{
  const connection = getConnection(network);
  const pubKey = new PublicKey(publicKey);
  const balance = await connection.getBalance(pubKey);
  return balance / LAMPORTS_PER_SOL; // lamports to SOL convert
} catch (error) {
    // Fallback to public RPC
    const fallback = new Connection('https://api.devnet.solana.com', 'confirmed');
    const pubKey = new PublicKey(publicKey);
    const balance = await fallback.getBalance(pubKey);
    return balance / LAMPORTS_PER_SOL;
  }
}

// Transfer SOL from one account to another
export async function transferSOL(
  secretKeyBase64: string,
  toAddress: string,
  amount: number,
  network: NetworkType
): Promise<string> {
  const connection = getConnection(network);
  const keypair = getKeypairFromSecret(secretKeyBase64);
  const toPublicKey = new PublicKey(toAddress);

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: keypair.publicKey,
      toPubkey: toPublicKey,
      lamports: amount * LAMPORTS_PER_SOL,
    })
  );

  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [keypair]
  );

  return signature; // transaction ID
}

// Fetch transaction history for a given public key and network
export async function getTransactionHistory(
  publicKey: string,
  network: NetworkType
): Promise<TxModel[]> {
  const connection = getConnection(network);
  const pubKey = new PublicKey(publicKey);

  const signatures = await connection.getSignaturesForAddress(pubKey, {
    limit: 20,
  });

  const transactions: TxModel[] = signatures.map((sig) => ({
    signature: sig.signature,
    from: publicKey,
    to: '',
    amount: 0,
    timestamp: sig.blockTime ? sig.blockTime * 1000 : Date.now(),
    status: sig.err ? 'failed' : 'success',
    fee: 0,
  }));

  return transactions;
}

//Devnet airdrop request for testing purposes
export async function requestAirdrop(
  publicKey: string,
  amount: number = 1
): Promise<string> {
  const connection = getConnection('devnet');
  const pubKey = new PublicKey(publicKey);
  const signature = await connection.requestAirdrop(
    pubKey,
    amount * LAMPORTS_PER_SOL
  );
  await connection.confirmTransaction(signature);
  return signature;
}