import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { useState } from 'react'
import { colors, spacing, borderRadius, typography } from '../../constants/theme'
import { userWalletStore } from '../../store/useWalletStore'
import { useNetworkState } from '../../store/useNetworkStore'
import { useBalance } from '../../hooks/useBalance'
import { transferSOL } from '../../services/solanaService'
import { getSecretKey } from '../../services/secureStorageServices'
import { authenticateWithBiometric } from '../../services/biometricService'

export default function SendScreen() {
  const router = useRouter()
  const { publicKey } = userWalletStore()
  const { network } = useNetworkState()
  const { balance, fetchBalance } = useBalance(publicKey)

  const [toAddress, setToAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [txSignature, setTxSignature] = useState<string | null>(null)

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])


  async function handleSend() {
    // Validation
    if (!toAddress.trim()) {
      Alert.alert('Error', 'Please enter recipient address')
      return
    }
    if (!amount.trim() || isNaN(Number(amount))) {
      Alert.alert('Error', 'Please enter valid amount')
      return
    }
    if (Number(amount) <= 0) {
      Alert.alert('Error', 'Amount must be greater than 0')
      return
    }
    if (Number(amount) > balance) {
      Alert.alert('Error', 'Insufficient balance')
      return
    }

    // Biometric verify
    const biometricSuccess = await authenticateWithBiometric(
      'Verify to send SOL'
    )
    if (!biometricSuccess) {
      Alert.alert('Error', 'Biometric verification failed')
      return
    }

    setIsLoading(true)
    try {
      // Secret key lo
      const secretKey = await getSecretKey()
      if (!secretKey) {
        Alert.alert('Error', 'Could not access wallet')
        return
      }

      // Transfer karo
      const signature = await transferSOL(
        secretKey,
        toAddress.trim(),
        Number(amount),
        network
      )

      setTxSignature(signature)
      await fetchBalance()

      Alert.alert(
        'Success! 🎉',
        `${amount} SOL sent successfully!`,
        [
          {
            text: 'View on Explorer',
            onPress: () => {
              // Explorer link
              console.log(`https://explorer.solana.com/tx/${signature}?cluster=${network}`)
            },
          },
          {
            text: 'Done',
            onPress: () => router.back(),
          },
        ]
      )
    } catch (error) {
      Alert.alert('Error', 'Transaction failed — check address and try again')
      console.error('Transfer failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  function handleMaxAmount() {
    // Reserve 0.001 SOL for transaction fee
    const maxAmount = Math.max(0, balance - 0.001)
    setAmount(maxAmount.toFixed(4))
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Send SOL</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Balance */}
        <View style={styles.balanceRow}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceValue}>{balance.toFixed(4)} SOL</Text>
        </View>

        {/* To Address Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Recipient Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Solana address"
            placeholderTextColor={colors.textMuted}
            value={toAddress}
            onChangeText={setToAddress}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Amount Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Amount (SOL)</Text>
          <View style={styles.amountRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="0.00"
              placeholderTextColor={colors.textMuted}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
            <TouchableOpacity
              style={styles.maxBtn}
              onPress={handleMaxAmount}
            >
              <Text style={styles.maxBtnText}>MAX</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Fee Info */}
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Network Fee</Text>
          <Text style={styles.feeValue}>~0.000005 SOL</Text>
        </View>

        {/* Send Button */}
        <TouchableOpacity
          style={[styles.sendBtn, isLoading && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.sendBtnText}>Send SOL ↑</Text>
          )}
        </TouchableOpacity>

        {/* Transaction Signature */}
        {txSignature && (
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Transaction ID</Text>
            <Text style={styles.signatureText} numberOfLines={2}>
              {txSignature}
            </Text>
          </View>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  backBtn: {
    backgroundColor: colors.card,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    width: 40,
    alignItems: 'center',
  },
  backText: {
    fontSize: 20,
    color: colors.text,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text,
  },
  balanceRow: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  balanceLabel: {
    ...typography.body,
    color: colors.textMuted,
  },
  balanceValue: {
    ...typography.body,
    color: colors.text,
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...typography.small,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    color: colors.text,
    ...typography.body,
    borderWidth: 1,
    borderColor: colors.border,
  },
  amountRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  maxBtn: {
    backgroundColor: colors.primary + '20',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  maxBtnText: {
    ...typography.small,
    color: colors.primary,
    fontWeight: '700',
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  feeLabel: {
    ...typography.small,
    color: colors.textMuted,
  },
  feeValue: {
    ...typography.small,
    color: colors.textMuted,
  },
  sendBtn: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  sendBtnDisabled: {
    opacity: 0.6,
  },
  sendBtnText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '700',
  },
  signatureBox: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  signatureLabel: {
    ...typography.small,
    color: colors.textMuted,
  },
  signatureText: {
    ...typography.tiny,
    color: colors.primary,
  },
})