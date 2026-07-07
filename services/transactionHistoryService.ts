import * as SecureStore from 'expo-secure-store'
import { Transaction } from '../models/transaction'

const TRANSACTION_HISTORY_KEY = 'solana_wallet_transactions'

export class TransactionHistoryService {
  // Save transaction to history
  static async saveTransaction(transaction: Transaction): Promise<void> {
    try {
      const existing = await this.getTransactionHistory()
      const updated = [transaction, ...existing]
      await SecureStore.setItemAsync(
        TRANSACTION_HISTORY_KEY,
        JSON.stringify(updated)
      )
    } catch (error) {
      console.error('Error saving transaction:', error)
      throw error
    }
  }

  // Get all transactions
  static async getTransactionHistory(): Promise<Transaction[]> {
    try {
      const data = await SecureStore.getItemAsync(TRANSACTION_HISTORY_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error fetching transaction history:', error)
      return []
    }
  }

  // Get transactions for a specific address
  static async getAddressTransactions(address: string): Promise<Transaction[]> {
    try {
      const all = await this.getTransactionHistory()
      return all.filter((tx) => tx.from === address || tx.to === address)
    } catch (error) {
      console.error('Error fetching address transactions:', error)
      return []
    }
  }

  // Get recent transactions (last N)
  static async getRecentTransactions(limit: number = 10): Promise<Transaction[]> {
    try {
      const all = await this.getTransactionHistory()
      return all.slice(0, limit)
    } catch (error) {
      console.error('Error fetching recent transactions:', error)
      return []
    }
  }

  // Clear transaction history
  static async clearHistory(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TRANSACTION_HISTORY_KEY)
    } catch (error) {
      console.error('Error clearing history:', error)
      throw error
    }
  }

  // Format transaction for display
  static formatTransaction(tx: Transaction) {
    return {
      ...tx,
      displayAmount: `${tx.amount.toFixed(4)} SOL`,
      displayFee: `${tx.fee.toFixed(6)} SOL`,
      displayDate: new Date(tx.timestamp).toLocaleDateString(),
      displayTime: new Date(tx.timestamp).toLocaleTimeString(),
      displayStatus: tx.status.charAt(0).toUpperCase() + tx.status.slice(1),
    }
  }
}
