import { useState, useCallback, useEffect } from 'react'
import { Transaction } from '../models/transaction'
import { TransactionHistoryService } from '../services/transactionHistoryService'

export function useTransactionHistory(address?: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      let data: Transaction[]
      if (address) {
        data = await TransactionHistoryService.getAddressTransactions(address)
      } else {
        data = await TransactionHistoryService.getTransactionHistory()
      }
      setTransactions(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch transactions'
      setError(message)
      setTransactions([])
    } finally {
      setIsLoading(false)
    }
  }, [address])

  const addTransaction = useCallback(
    async (transaction: Transaction) => {
      try {
        await TransactionHistoryService.saveTransaction(transaction)
        await fetchTransactions()
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to add transaction'
        setError(message)
      }
    },
    [fetchTransactions]
  )

  const clearHistory = useCallback(async () => {
    try {
      await TransactionHistoryService.clearHistory()
      setTransactions([])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to clear history'
      setError(message)
    }
  }, [])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return {
    transactions,
    isLoading,
    error,
    fetchTransactions,
    addTransaction,
    clearHistory,
  }
}
