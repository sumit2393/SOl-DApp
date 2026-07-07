import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { useState, useEffect } from 'react'
import * as Clipboard from 'expo-clipboard'
import { colors, spacing, borderRadius } from '../../constants/theme'
import { userWalletStore } from '../../store/useWalletStore'
import { useTransactionHistory } from '../../hooks/useTransactionHistory'
import { Transaction } from '../../models/transaction'

export default function ActivityScreen() {
  const store = userWalletStore()
  const { publicKey } = store
  const { transactions, isLoading, error, fetchTransactions, clearHistory } =
    useTransactionHistory(publicKey)
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchTransactions()
    setRefreshing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return '#10b981'
      case 'failed':
        return '#ef4444'
      case 'pending':
        return '#f59e0b'
      default:
        return colors.primary
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return '✓'
      case 'failed':
        return '✕'
      case 'pending':
        return '⏳'
      default:
        return '◉'
    }
  }

  const getTransactionType = (tx: Transaction) => {
    if (tx.from === publicKey) {
      return { type: 'Sent', icon: '↗', color: '#ef4444' }
    } else if (tx.to === publicKey) {
      return { type: 'Received', icon: '↙', color: '#10b981' }
    } else {
      return { type: 'Swap', icon: '↕', color: colors.primary }
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await Clipboard.setStringAsync(text)
      Alert.alert('Copied!', 'Transaction hash copied to clipboard')
    } catch (error) {
      Alert.alert('Error', 'Failed to copy')
    }
  }

  const formatAddress = (address: string) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const renderTransactionItem = ({ item }: { item: Transaction }) => {
    const txType = getTransactionType(item)
    const statusColor = getStatusColor(item.status)
    const statusIcon = getStatusIcon(item.status)
    const date = new Date(item.timestamp)
    const timeString = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
    const dateString = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })

    return (
      <TouchableOpacity
        style={styles.transactionCard}
        onPress={() => copyToClipboard(item.signature)}
      >
        <View style={styles.transactionContent}>
          {/* Left: Icon and Type */}
          <View style={[styles.iconContainer, { borderColor: txType.color }]}>
            <Text style={[styles.icon, { color: txType.color }]}>{txType.icon}</Text>
          </View>

          {/* Middle: Details */}
          <View style={styles.detailsContainer}>
            <View style={styles.typeRow}>
              <Text style={styles.transactionType}>{txType.type}</Text>
              <Text style={styles.signature}>{formatAddress(item.signature)}</Text>
            </View>
            <View style={styles.addressRow}>
              <Text style={styles.address}>{formatAddress(item.to)}</Text>
              <Text style={styles.dateTime}>
                {dateString} • {timeString}
              </Text>
            </View>
          </View>

          {/* Right: Amount and Status */}
          <View style={styles.rightContainer}>
            <Text style={[styles.amount, { color: txType.color }]}>
              {txType.type === 'Sent' ? '-' : '+'}
              {item.amount.toFixed(4)} SOL
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
              <Text style={[styles.statusIcon, { color: statusColor }]}>{statusIcon}</Text>
              <Text style={[styles.statusText, { color: statusColor }]}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          </View>
        </View>

        {/* Fee Info */}
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Network Fee</Text>
          <Text style={styles.feeValue}>{item.fee.toFixed(6)} SOL</Text>
        </View>
      </TouchableOpacity>
    )
  }

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📋</Text>
      <Text style={styles.emptyTitle}>No Transactions</Text>
      <Text style={styles.emptyText}>
        Your transaction history will appear here once you make your first transaction.
      </Text>
    </View>
  )

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Activity</Text>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchTransactions}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Activity</Text>
        {transactions.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              Alert.alert('Clear History?', 'This action cannot be undone.', [
                { text: 'Cancel', onPress: () => {} },
                { text: 'Clear', onPress: clearHistory, style: 'destructive' },
              ])
            }}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.signature}
        renderItem={renderTransactionItem}
        ListEmptyComponent={renderEmptyState}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        scrollEventThrottle={16}
        contentContainerStyle={transactions.length === 0 && styles.emptyListContent}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    paddingHorizontal: spacing.md,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  clearButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: '#ef4444' + '20',
  },
  clearButtonText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600',
  },
  transactionCard: {
    backgroundColor: '#111111',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#222222',
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 24,
  },
  detailsContainer: {
    flex: 1,
  },
  typeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  transactionType: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  signature: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'Menlo',
  },
  addressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  address: {
    fontSize: 12,
    color: '#666',
  },
  dateTime: {
    fontSize: 12,
    color: '#555',
  },
  rightContainer: {
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  amount: {
    fontSize: 14,
    fontWeight: '700',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    gap: 4,
  },
  statusIcon: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#222222',
  },
  feeLabel: {
    fontSize: 11,
    color: '#666',
  },
  feeValue: {
    fontSize: 11,
    color: '#888',
    fontWeight: '500',
  },
  emptyListContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    maxWidth: '80%',
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  retryButtonText: {
    color: '#000',
    fontWeight: '600',
  },
})
