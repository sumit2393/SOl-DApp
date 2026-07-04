import { useState, useCallback } from 'react';
import { getBalance } from '../services/solanaService';
import { useNetworkState} from '../store/useNetworkStore';

export function useBalance(publicKey: string | null) {
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { network } = useNetworkState();

  const fetchBalance = useCallback(async () => {
    if (!publicKey) return;
    setIsLoading(true);
    setError(null);
    try {
      const bal = await getBalance(publicKey, network);
      setBalance(bal);
    } catch (err) {
      setError('Failed to fetch balance');
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, network]);

  return {
    balance,
    isLoading,
    error,
    fetchBalance,
  };
}