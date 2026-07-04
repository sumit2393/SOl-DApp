export interface Transaction {
  signature: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
  status: 'success' | 'failed' | 'pending';
  fee: number;
}

export interface Token {
  mint: string;
  symbol: string;
  name: string;
  balance: number;
  decimals: number;
  logoUri?: string;
}