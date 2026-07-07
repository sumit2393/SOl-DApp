import { useState, useEffect, useCallback } from 'react';
import { getSOLPrice, getTopTokenPrices, TokenPrice } from '../services/priceService';

// SOL price hook
export function useSOLPrice() {
  const [price, setPrice] = useState<TokenPrice | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrice = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getSOLPrice();
      setPrice(data);
    } catch (err) {
      setError('Failed to fetch SOL price');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrice();
    // Har 30 seconds mein update
    const interval = setInterval(fetchPrice, 30000);
    return () => clearInterval(interval);
  }, [fetchPrice]);

  return { price, isLoading, error, fetchPrice };
}

// Top tokens price hook (BTC, ETH, SOL)
export function useTopPrices() {
  const [prices, setPrices] = useState<TokenPrice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTopTokenPrices();
      setPrices(data);
    } catch (err) {
      setError('Failed to fetch prices');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    // Har 30 seconds mein update
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  return { prices, isLoading, error, fetchPrices };
}