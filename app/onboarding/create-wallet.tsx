import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { colors, spacing, borderRadius, typography } from '../../constants/theme'
import { generateWallet } from '../../services/walletServices'
import { saveToSecureStorage } from '../../services/secureStorageServices'
import { userWalletStore } from '../../store/useWalletStore'
import { WalletData } from '../../models/wallet'

export default function CreateWalletScreen() {
  const router = useRouter()
  const { setPublicKey } = userWalletStore()
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleGenerateWallet() {
    setIsLoading(true)
    try {
      const newWallet = generateWallet()
      setWallet(newWallet)
    } catch (error) {
      console.error('Wallet generate failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSaveWallet() {
    if (!wallet) return
    setIsLoading(true)
    try {
      await saveToSecureStorage(String(wallet.secretKey), wallet.publicKey)
      setPublicKey(wallet.publicKey)
      router.push('/onboarding/confirm-seed' as any)
    } catch (error) {
      console.error('Wallet save failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Wallet</Text>
      <Text style={styles.subtitle}>
        Your secret seed phrase — never share with anyone
      </Text>

      {wallet && (
        <View style={styles.seedBox}>
          <View style={styles.seedGrid}>
            {wallet.mnemonic.split(' ').map((word, index) => (
              <View key={index} style={styles.seedWord}>
                <Text style={styles.seedIndex}>{String(index + 1)}</Text>
                <Text style={styles.seedWordText}>{word}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {!wallet ? (
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleGenerateWallet}
          disabled={isLoading}
        >
          {isLoading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.primaryBtnText}>Generate Seed Phrase</Text>
          }
        </TouchableOpacity>
      ) : (
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={handleGenerateWallet}
          >
            <Text style={styles.secondaryBtnText}>Regenerate</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={handleSaveWallet}
            disabled={isLoading}
          >
            {isLoading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.primaryBtnText}>I have saved my phrase</Text>
            }
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
    paddingTop: 80,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: spacing.xl,
  },
  seedBox: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  seedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  seedWord: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    width: '30%',
    gap: spacing.xs,
  },
  seedIndex: {
    ...typography.tiny,
    color: colors.textMuted,
  },
  seedWordText: {
    ...typography.small,
    color: colors.text,
  },
  buttons: {
    gap: spacing.md,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  primaryBtnText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '700',
  },
  secondaryBtn: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryBtnText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
})