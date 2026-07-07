import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useState, useEffect } from 'react'
import { colors, spacing, borderRadius, typography } from '../../../constants/theme'
import { userWalletStore } from '../../../store/useWalletStore'
import { useNetworkState } from '../../../store/useNetworkStore'
import { clearWallet } from '../../../services/secureStorageServices'
import { isBiometricAvailable, getBiometricType } from '../../../services/biometricService'
import { NETWORKS } from '../../../constants/network'

export default function SettingsScreen() {
  const router = useRouter()
  const store = userWalletStore()
  const { network, setNetwork } = useNetworkState()
  const [biometricAvailable, setBiometricAvailable] = useState(false)
  const [biometricEnabled, setBiometricEnabled] = useState(false)
  const [biometricType, setBiometricType] = useState('Biometric')

  useEffect(() => {
    checkBiometric()
  }, [])

  async function checkBiometric() {
    const available = await isBiometricAvailable()
    const type = await getBiometricType()
    setBiometricAvailable(available)
    setBiometricType(type)
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

  function handleNetworkChange(newNetwork: 'devnet' | 'mainnet' | 'testnet') {
    Alert.alert(
      'Switch Network',
      `Switch to ${NETWORKS[newNetwork].name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Switch',
          onPress: () => setNetwork(newNetwork),
        },
      ]
    )
  }

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* Security Section */}
      <Text style={styles.sectionTitle}>Security</Text>
      <View style={styles.section}>

        {/* Biometric */}
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>{biometricType}</Text>
            <Text style={styles.settingDesc}>
              {biometricAvailable ? 'Available' : 'Not available on this device'}
            </Text>
          </View>
          <Switch
            value={biometricEnabled}
            onValueChange={setBiometricEnabled}
            disabled={!biometricAvailable}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={biometricEnabled ? '#ffffff' : '#888888'}
          />
        </View>

        {/* View Seed Phrase */}
        <TouchableOpacity
          style={styles.settingRow}
          onPress={() => router.push('/(wallet)/settings/security' as any)}
        >
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>View Seed Phrase</Text>
            <Text style={styles.settingDesc}>Backup your wallet</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

      </View>

      {/* Network Section */}
      <Text style={styles.sectionTitle}>Network</Text>
      <View style={styles.section}>
        {(['devnet', 'mainnet', 'testnet'] as const).map((net) => (
          <TouchableOpacity
            key={net}
            style={styles.settingRow}
            onPress={() => handleNetworkChange(net)}
          >
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>{NETWORKS[net].name}</Text>
              <Text style={styles.settingDesc}>
                {net === 'mainnet' ? 'Real SOL' : 'Test SOL'}
              </Text>
            </View>
            {network === net && (
              <Text style={[styles.activeText, { color: NETWORKS[net].color }]}>
                ● Active
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Account Section */}
      <Text style={styles.sectionTitle}>Account</Text>
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.settingRow}
          onPress={handleLogout}
        >
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: colors.error }]}>
              Logout
            </Text>
            <Text style={styles.settingDesc}>Remove wallet from device</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Version */}
      <Text style={styles.version}>Solana Wallet v1.0.0</Text>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.xl,
    paddingTop: 60,
    marginBottom: spacing.sm,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.text,
  },
  sectionTitle: {
    ...typography.small,
    color: colors.textMuted,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  section: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingInfo: {
    flex: 1,
    gap: 2,
  },
  settingLabel: {
    ...typography.body,
    color: colors.text,
  },
  settingDesc: {
    ...typography.tiny,
    color: colors.textMuted,
  },
  arrow: {
    fontSize: 18,
    color: colors.textMuted,
  },
  activeText: {
    ...typography.small,
    fontWeight: '700',
  },
  version: {
    ...typography.tiny,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
})