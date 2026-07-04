import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl, ScrollView, Alert } from 'react-native'
import * as Clipboard from 'expo-clipboard'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { colors, spacing, borderRadius, typography } from '../../constants/theme'
import { userWalletStore } from '../../store/useWalletStore'
import { useNetworkState } from '../../store/useNetworkStore'
import { useBalance } from '../../hooks/useBalance'
import { requestAirdrop } from '../../services/solanaService'

export default function DashboardScreen() {
  const router = useRouter()
  const { publicKey } = userWalletStore()
  const { network } = useNetworkState()
  const { balance, isLoading, fetchBalance } = useBalance(publicKey)

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  async function handleAirdrop() {
    if (!publicKey) return
    try {
      await requestAirdrop(publicKey, 1)
      fetchBalance()
    } catch (error) {
      console.error('Airdrop failed:', error)
    }
  }

  async function handleCopyAddress() {
    if (!publicKey) return
    await Clipboard.setStringAsync(publicKey)
    Alert.alert('Copied!', 'Public address copied to clipboard')
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={fetchBalance}
          tintColor={colors.primary}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Wallet</Text>
        <TouchableOpacity
          style={styles.networkBadge}
          onPress={() => router.push('/settings/network' as any)}
        >
          <Text style={styles.networkText}>{network}</Text>
        </TouchableOpacity>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        {isLoading ? (
          <ActivityIndicator color={colors.primary} size="large" />
        ) : (
          <Text style={styles.balanceAmount}>{balance.toFixed(4)} SOL</Text>
        )}

        {/* Public Key + Copy Button */}
        <TouchableOpacity
          style={styles.addressRow}
          onPress={handleCopyAddress}
        >
          <Text style={styles.publicKey} numberOfLines={1} ellipsizeMode="middle">
            {publicKey}
          </Text>
          <Text style={styles.copyIcon}>⎘</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push('/wallet/send' as any)}
        >
          <Text style={styles.actionIcon}>↑</Text>
          <Text style={styles.actionText}>Send</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push('/wallet/receive' as any)}
        >
          <Text style={styles.actionIcon}>↓</Text>
          <Text style={styles.actionText}>Receive</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push('/wallet/history' as any)}
        >
          <Text style={styles.actionIcon}>⟳</Text>
          <Text style={styles.actionText}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push('/settings/security' as any)}
        >
          <Text style={styles.actionIcon}>⚙</Text>
          <Text style={styles.actionText}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Airdrop Button (Devnet only)
      {network === 'devnet' && (
        // <TouchableOpacity
        //   style={styles.airdropBtn}
        //   onPress={handleAirdrop}
        // >
        //   <Text style={styles.airdropBtnText}>Request Airdrop (1 SOL)</Text>
        // </TouchableOpacity>
      )} */}

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
    paddingTop: 60,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text,
  },
  networkBadge: {
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  networkText: {
    ...typography.small,
    color: colors.secondary,
    fontWeight: '600',
  },
  balanceCard: {
    backgroundColor: colors.card,
    margin: spacing.xl,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  balanceLabel: {
    ...typography.small,
    color: colors.textMuted,
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.text,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
    width: '100%',
  },
  publicKey: {
    ...typography.tiny,
    color: colors.textMuted,
    flex: 1,
  },
  copyIcon: {
    fontSize: 16,
    color: colors.primary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionIcon: {
    fontSize: 24,
    color: colors.primary,
  },
  actionText: {
    ...typography.tiny,
    color: colors.text,
  },
  airdropBtn: {
    backgroundColor: colors.card,
    margin: spacing.xl,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  airdropBtnText: {
    ...typography.body,
    color: colors.secondary,
    fontWeight: '600',
  },
})