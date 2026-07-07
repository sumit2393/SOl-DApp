import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Alert,
} from 'react-native'
import * as Clipboard from 'expo-clipboard'
import { useRouter } from 'expo-router'
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect } from 'react'
import { colors, spacing, borderRadius, typography } from '../../constants/theme'
import { userWalletStore } from '../../store/useWalletStore'
import { useNetworkState } from '../../store/useNetworkStore'
import { useBalance } from '../../hooks/useBalance'
import { useSOLPrice, useTopPrices } from '../../hooks/usePrice'
import { requestAirdrop } from '../../services/solanaService'
import { clearWallet } from '../../services/secureStorageServices'

export default function DashboardScreen() {
  const router = useRouter()
  const store = userWalletStore()
  const { publicKey } = store
  const { network } = useNetworkState()
  const { balance, isLoading, fetchBalance } = useBalance(publicKey)
  const { price } = useSOLPrice()
  const { prices } = useTopPrices()

  const usdValue = price ? (balance * price.price).toFixed(2) : '0.00'

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  async function handleAirdrop() {
    if (!publicKey) return
    try {
      await requestAirdrop(publicKey, 1)
      await fetchBalance()
    } catch (error) {
      Alert.alert('Error', 'Airdrop failed — use faucet.solana.com')
    }
  }

  async function handleCopyAddress() {
    if (!publicKey) return
    await Clipboard.setStringAsync(publicKey)
    Alert.alert('Copied!', 'Address copied to clipboard')
  }

  async function handleLogout() {
    Alert.alert(
      'Logout',
      'Are you sure? Make sure you have saved your seed phrase.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await clearWallet()
            store.reset()
            router.replace('/onboarding/welcome' as any)
          },
        },
      ]
    )
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
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.networkBadge}
            onPress={() => router.push('/(wallet)/settings/network' as any)}
          >
            <Text style={styles.networkText}>{network}</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>⏏</Text>
          </TouchableOpacity> */}
        </View>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        {isLoading ? (
          <ActivityIndicator color={colors.primary} size="large" />
        ) : (
          <>
            <Text style={styles.balanceAmount}>{balance.toFixed(4)} SOL</Text>
            <Text style={styles.usdValue}>${usdValue} USD</Text>
          </>
        )}

        {/* Address Row */}
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
          onPress={() => router.push('/(wallet)/send' as any)}
        >
          <Text style={styles.actionIcon}>↑</Text>
          <Text style={styles.actionText}>Send</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push('/(wallet)/receive' as any)}
        >
          <Text style={styles.actionIcon}>↓</Text>
          <Text style={styles.actionText}>Receive</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push('/(wallet)/settings' as any)}
        >
          <Text style={styles.actionIcon}>⚙</Text>
          <Text style={styles.actionText}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Airdrop Button (Devnet only)
      {network === 'devnet' && (
        <TouchableOpacity
          style={styles.airdropBtn}
          onPress={handleAirdrop}
        >
          <Text style={styles.airdropBtnText}>🪂 Request Airdrop (1 SOL)</Text>
        </TouchableOpacity>
      )} */}

      {/* Market Prices */}
      <View style={styles.marketSection}>
        <Text style={styles.sectionTitle}>Market</Text>
        {prices.map((token: { id: Key | null | undefined; symbol: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; price: { toLocaleString: (arg0: string, arg1: { maximumFractionDigits: number }) => string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }; change24h: number }) => (
          <TouchableOpacity
            key={token.id}
            style={styles.priceRow}
            onPress={() => router.push('/(wallet)/market' as any)}
          >
            <View style={styles.tokenInfo}>
              <Text style={styles.tokenSymbol}>{token.symbol}</Text>
              <Text style={styles.tokenName}>{token.name}</Text>
            </View>
            <View style={styles.tokenPrice}>
              <Text style={styles.priceText}>
                ${token.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </Text>
              <Text style={[
                styles.changeText,
                { color: token.change24h > 0 ? colors.secondary : colors.error }
              ]}>
                {token.change24h > 0 ? '▲' : '▼'} {Math.abs(token.change24h).toFixed(2)}%
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
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
  logoutBtn: {
    backgroundColor: colors.card,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  logoutText: {
    fontSize: 16,
    color: colors.error,
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
  usdValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textMuted,
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
    marginTop: spacing.md,
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
  marketSection: {
    margin: spacing.xl,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tokenInfo: {
    gap: 2,
  },
  tokenSymbol: {
    ...typography.body,
    color: colors.text,
    fontWeight: '700',
  },
  tokenName: {
    ...typography.tiny,
    color: colors.textMuted,
  },
  tokenPrice: {
    alignItems: 'flex-end',
    gap: 2,
  },
  priceText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  changeText: {
    ...typography.tiny,
    fontWeight: '600',
  },
})