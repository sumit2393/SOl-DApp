import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { colors, spacing, borderRadius, typography } from '../../constants/theme'

export default function WelcomeScreen() {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.logo}>◎</Text>
        <Text style={styles.title}>Solana Wallet</Text>
        <Text style={styles.subtitle}>Secure. Fast. Decentralized.</Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push('/onboarding/create-wallet' as any)}
        >
          <Text style={styles.primaryBtnText}>Create New Wallet</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.push('/onboarding/import-wallet' as any)}
        >
          <Text style={styles.secondaryBtnText}>Import Existing Wallet</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
    padding: spacing.xl,
    paddingTop: 120,
    paddingBottom: spacing.xxl,
  },
  hero: {
    alignItems: 'center',
    gap: spacing.md,
  },
  logo: {
    fontSize: 80,
    color: colors.primary,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
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