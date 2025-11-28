import React from 'react';
import { Tabs } from 'expo-router';
import { User, Spade, Flame } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#0E0F12', borderTopColor: 'rgba(255,255,255,0.06)' },
        sceneStyle: { backgroundColor: '#0E0F12' },
        tabBarActiveTintColor: '#00E6E6',
        tabBarInactiveTintColor: '#9BA0A6',
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
