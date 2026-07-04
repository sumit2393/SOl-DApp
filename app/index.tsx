import { useEffect } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { walletExist, getPublicKey } from '../services/secureStorageServices'
import { userWalletStore } from '../store/useWalletStore'
import { colors } from '../constants/theme'

export default function SplashScreen() {
  const router = useRouter()
  const { setPublicKey } = userWalletStore()

  useEffect(() => {
    checkWallet()
  }, [])

  async function checkWallet() {
    const exists = await walletExist()
    if (exists) {
      const publicKey = await getPublicKey()
      if (publicKey) setPublicKey(publicKey)
      router.replace('/wallet/dashboard' as any)
    } else {
      router.replace('/onboarding/welcome' as any)
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator color={colors.primary} size="large" />
    </View>
  )
}