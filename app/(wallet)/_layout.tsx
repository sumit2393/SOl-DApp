import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../constants/theme'
import { StyleSheet, useWindowDimensions, View } from 'react-native'

export default function WalletLayout() {
  const { width, height } = useWindowDimensions()
  const isCompact = width < 360 || height < 700

  const renderTabIcon = (name: keyof typeof Ionicons.glyphMap, focused: boolean, color: any) => (
    <View style={[styles.tabIconContainer, focused && styles.tabIconContainerActive]}>
      <Ionicons name={name} size={isCompact ? 24 : 26} color={color ?? colors.primary} />
    </View>
  )

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#111111',
          borderTopColor: '#222222',
          borderTopWidth: 1,
          height: isCompact ? 78 : 88,
          paddingBottom: isCompact ? 10 : 20,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#555555',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => renderTabIcon('home-outline', focused, color),
        }}
      />
      <Tabs.Screen
        name="swap"
        options={{
          title: 'Swap',
          tabBarIcon: ({ color, focused }) => renderTabIcon('swap-horizontal-outline', focused, color),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'History',
          tabBarIcon: ({ color, focused }) => renderTabIcon('time-outline', focused, color),
        }}
      />
      <Tabs.Screen
        name="send"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="receive"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{ href: null }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabIconContainer: {
    padding: 6,
    borderRadius: 12,
    minWidth: 42,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconContainerActive: {
    backgroundColor: colors.primary + '20',
  },
})