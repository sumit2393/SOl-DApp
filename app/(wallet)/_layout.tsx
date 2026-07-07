import { Tabs } from 'expo-router'
import { colors } from '../../constants/theme'
import { Text, View } from 'react-native'

export default function WalletLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#111111',
          borderTopColor: '#222222',
          borderTopWidth: 1,
          height: 85,
          paddingBottom: 25,
          paddingTop: 10,
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
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? colors.primary + '20' : 'transparent',
              padding: 6,
              borderRadius: 10,
            }}>
              <Text style={{ fontSize: 20, color }}>◎</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="swap"
        options={{
          title: 'Swap',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? colors.primary + '20' : 'transparent',
              padding: 6,
              borderRadius: 10,
            }}>
              <Text style={{ fontSize: 20, color }}>↕</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'History',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? colors.primary + '20' : 'transparent',
              padding: 6,
              borderRadius: 10,
            }}>
              <Text style={{ fontSize: 20, color }}>⟳</Text>
            </View>
          ),
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