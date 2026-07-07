import '../polyfills'
import { Stack, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import * as SplashScreen from 'expo-splash-screen'
import { userWalletStore } from '../store/useWalletStore'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const router = useRouter()
  const { publicKey } = userWalletStore()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const prepare = async () => {
      try {
        // Simulate checking auth state
        await new Promise((resolve) => setTimeout(resolve, 2500))

        if (publicKey) {
          router.replace('/(wallet)/dashboard')
        } else {
          router.replace('/onboarding/welcome')
        }
      } catch (error) {
        console.error('Error preparing app:', error)
      } finally {
        await SplashScreen.hideAsync()
        setIsReady(true)
      }
    }

    prepare()
  }, [publicKey])

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0a0a0a' },
        sheetResizeAnimationEnabled: false,
      }}
    >
      <Stack.Screen
        name="splash"
        options={{
          gestureEnabled: false,
        }}
      />
    </Stack>
  )
}