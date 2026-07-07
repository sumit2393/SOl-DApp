import { useEffect } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import * as SplashScreen from 'expo-splash-screen'
import { useRouter } from 'expo-router'

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

export default function Splash() {
  const router = useRouter()
  const scaleAnim = new Animated.Value(0.8)
  const opacityAnim = new Animated.Value(0)

  useEffect(() => {
    // Animate splash screen
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start()

    // Simulate loading resources
    const timer = setTimeout(async () => {
      await SplashScreen.hideAsync()
      // Navigation will be handled by root layout based on auth state
    }, 4500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <Text style={styles.logo}>◎</Text>
        <Text style={styles.title}>SolanaWallet</Text>
        <Text style={styles.subtitle}>Your Web3 Gateway</Text>
      </Animated.View>

      <View style={styles.loaderContainer}>
        <View style={styles.loaderDot} />
        <View style={[styles.loaderDot, { marginLeft: 8 }]} />
        <View style={[styles.loaderDot, { marginLeft: 8 }]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    marginBottom: 100,
  },
  logo: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#888888',
    letterSpacing: 1,
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 100,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loaderDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00d9ff',
  },
})
