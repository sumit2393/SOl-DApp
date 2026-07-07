import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native'
import { useState, useEffect } from 'react'
import { colors, spacing, borderRadius, typography } from '../../constants/theme'
import { userWalletStore } from '../../store/useWalletStore'
import { useBalance } from '../../hooks/useBalance'
import { useSOLPrice, useTopPrices } from '../../hooks/usePrice'

export default function SwapScreen() {
  const store = userWalletStore()
  const { publicKey } = store
  const { balance } = useBalance(publicKey)
  const { price: solPrice } = useSOLPrice()

  const [fromToken, setFromToken] = useState('SOL')
  const [toToken, setToToken] = useState('USDC')
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const supportedTokens = ['SOL', 'USDC', 'USDT', 'BONK', 'JUP']

  // Calculate exchange rate
  useEffect(() => {
    if (fromAmount && solPrice) {
      const amount = parseFloat(fromAmount)
      if (!isNaN(amount)) {
        // Simple conversion (1 SOL = price in USDC)
        const converted = (amount * solPrice.price).toFixed(2)
        setToAmount(converted)
      }
    }
  }, [fromAmount, solPrice])

  const handleSwap = () => {
    if (!fromAmount || parseFloat(fromAmount) === 0) {
      Alert.alert('Error', 'Please enter an amount')
      return
    }

    if (parseFloat(fromAmount) > balance) {
      Alert.alert('Error', 'Insufficient balance')
      return
    }

    setIsLoading(true)
    // Simulate swap
    setTimeout(() => {
      Alert.alert('Success', `Swapped ${fromAmount} ${fromToken} to ${toAmount} ${toToken}`)
      setFromAmount('')
      setToAmount('')
      setIsLoading(false)
    }, 2000)
  }

  const handleReverse = () => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount('')
    setToAmount('')
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Swap Tokens</Text>

      {/* From Token */}
      <View style={styles.card}>
        <Text style={styles.label}>From</Text>
        <View style={styles.tokenSection}>
          <View style={styles.tokenInputGroup}>
            <TextInput
              style={styles.amountInput}
              placeholder="0"
              placeholderTextColor="#888"
              keyboardType="decimal-pad"
              value={fromAmount}
              onChangeText={setFromAmount}
            />
            <Text style={styles.tokenName}>{fromToken}</Text>
          </View>
        </View>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceLabel}>Balance:</Text>
          <Text style={styles.balanceValue}>
            {balance.toFixed(4)} {fromToken}
          </Text>
        </View>
      </View>

      {/* Reverse Button */}
      <TouchableOpacity style={styles.reverseButton} onPress={handleReverse}>
        <Text style={styles.reverseButtonText}>⇅</Text>
      </TouchableOpacity>

      {/* To Token */}
      <View style={styles.card}>
        <Text style={styles.label}>To</Text>
        <View style={styles.tokenSection}>
          <View style={styles.tokenInputGroup}>
            <TextInput
              style={[styles.amountInput, { color: colors.text }]}
              placeholder="0"
              placeholderTextColor="#888"
              value={toAmount}
              editable={false}
            />
            <Text style={styles.tokenName}>{toToken}</Text>
          </View>
        </View>
        <View style={styles.exchangeRateRow}>
          <Text style={styles.exchangeRateLabel}>Rate:</Text>
          <Text style={styles.exchangeRateValue}>
            1 {fromToken} = {solPrice?.price.toFixed(2)} {toToken}
          </Text>
        </View>
      </View>

      {/* Fee Info */}
      <View style={styles.feeCard}>
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Platform Fee</Text>
          <Text style={styles.feeValue}>0.25%</Text>
        </View>
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Network Fee</Text>
          <Text style={styles.feeValue}>0.00025 SOL</Text>
        </View>
      </View>

      {/* Swap Button */}
      <TouchableOpacity
        style={[styles.swapButton, isLoading && styles.swapButtonDisabled]}
        onPress={handleSwap}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.swapButtonText}>Swap Now</Text>
        )}
      </TouchableOpacity>

      {/* Info */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          💡 Prices update every minute. You may experience slippage during execution.
        </Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    padding: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.lg,
    marginTop: spacing.md,
  },
  card: {
    backgroundColor: '#111111',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#222222',
  },
  label: {
    fontSize: 12,
    color: '#888',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tokenSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  tokenInputGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: colors.primary,
  },
  tokenName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#222222',
  },
  balanceLabel: {
    fontSize: 12,
    color: '#666',
  },
  balanceValue: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  exchangeRateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#222222',
  },
  exchangeRateLabel: {
    fontSize: 12,
    color: '#666',
  },
  exchangeRateValue: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  reverseButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: spacing.md,
    marginBottom: -spacing.lg,
    zIndex: 10,
  },
  reverseButtonText: {
    fontSize: 24,
    color: colors.primary,
  },
  feeCard: {
    backgroundColor: '#111111',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#222222',
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  feeLabel: {
    fontSize: 12,
    color: '#888',
  },
  feeValue: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },
  swapButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  swapButtonDisabled: {
    opacity: 0.6,
  },
  swapButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  infoBox: {
    backgroundColor: '#1a1a2e',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  infoText: {
    fontSize: 12,
    color: '#aaa',
    lineHeight: 18,
  },
})