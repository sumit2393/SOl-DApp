import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { colors, spacing, borderRadius, typography } from '../../constants/theme'
import { mnemonicToWallet, isValidMnemonic } from '../../services/walletServices'
import { saveToSecureStorage } from '../../services/secureStorageServices'
import { userWalletStore } from '../../store/useWalletStore'

export default function ImportWalletScreen() {
  const router = useRouter()
  const { setPublicKey } = userWalletStore()
  const [mnemonic, setMnemonic] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleImport() {
    const cleanMnemonic = mnemonic.trim().toLowerCase()

    // Validation
    if (!cleanMnemonic) {
      Alert.alert('Error', 'Please enter your seed phrase')
      return
    }

    if (!isValidMnemonic(cleanMnemonic)) {
      Alert.alert('Error', 'Invalid seed phrase — check your words and try again')
      return
    }

    setIsLoading(true)
    try {
      const wallet = mnemonicToWallet(cleanMnemonic)
      await saveToSecureStorage(String(wallet.secretKey), wallet.publicKey)
      setPublicKey(wallet.publicKey)
      router.replace('/(wallet)/dashboard' as any)
    } catch (error) {
      Alert.alert('Error', 'Failed to import wallet — try again')
      console.error('Import failed:', error)
    } finally {
      setIsLoading(false)
    }
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
          <Text style={styles.headerTitle}>Import Wallet</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Enter your 12 or 24 word seed phrase to restore your wallet
          </Text>
        </View>

        {/* Seed Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Seed Phrase</Text>
          <TextInput
            style={styles.seedInput}
            placeholder="Enter your seed phrase words separated by spaces..."
            placeholderTextColor={colors.textMuted}
            value={mnemonic}
            onChangeText={setMnemonic}
            multiline
            numberOfLines={4}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text style={styles.wordCount}>
            {mnemonic.trim() === '' ? 0 : mnemonic.trim().split(/\s+/).length} / 12 words
          </Text>
        </View>

        {/* Warning */}
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            ⚠️ Never share your seed phrase with anyone. Solana Wallet will never ask for it.
          </Text>
        </View>

        {/* Import Button */}
        <TouchableOpacity
          style={[styles.importBtn, isLoading && styles.importBtnDisabled]}
          onPress={handleImport}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.importBtnText}>Import Wallet</Text>
          )}
        </TouchableOpacity>

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
  infoBox: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: spacing.xl,
  },
  inputLabel: {
    ...typography.small,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  seedInput: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    color: colors.text,
    ...typography.body,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  wordCount: {
    ...typography.tiny,
    color: colors.textMuted,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  warningBox: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: '#FFB800',
  },
  warningText: {
    ...typography.small,
    color: '#FFB800',
    textAlign: 'center',
  },
  importBtn: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  importBtnDisabled: {
    opacity: 0.6,
  },
  importBtnText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '700',
  },
})