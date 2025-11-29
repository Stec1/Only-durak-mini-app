import React from 'react';
import { Tabs } from 'expo-router';
import { User, Spade, Flame } from 'lucide-react-native';
import { useThemeCtx } from '@/src/contexts/theme';

export default function TabsLayout() {
  const { theme } = useThemeCtx();

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: theme.tabBarBg, borderTopColor: theme.border },
        sceneStyle: { backgroundColor: theme.bg },
        tabBarActiveTintColor: theme.tabBarActive,
        tabBarInactiveTintColor: theme.tabBarInactive,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Flame color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="game"
        options={{
          title: 'Game',
          tabBarIcon: ({ color, size }) => <Spade color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
