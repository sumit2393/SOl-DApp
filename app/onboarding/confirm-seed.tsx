import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { colors, spacing, borderRadius, typography } from '../../constants/theme'

export default function ConfirmSeedScreen() {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Seed</Text>
      <Text style={styles.subtitle}>
        Verify your seed phrase to continue
      </Text>

      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={() => router.push('/(c s)/dashboard' as any)}
      >
        <Text style={styles.primaryBtnText}>Continue to Dashboard</Text>
      </TouchableOpacity>
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
})