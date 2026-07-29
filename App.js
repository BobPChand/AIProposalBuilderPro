import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import ProposalScreen from './src/screens/ProposalScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import PaywallScreen from './src/screens/PaywallScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#4A90E2',
          tabBarInactiveTintColor: '#8E8E93',
          tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E5E5EA' },
          headerShown: false,
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen}
          options={{ tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} /> }}
        />
        <Tab.Screen name="Proposals" component={ProposalScreen}
          options={{ tabBarIcon: ({ color }) => <Ionicons name="document-text" size={24} color={color} /> }}
        />
        <Tab.Screen name="History" component={HistoryScreen}
          options={{ tabBarIcon: ({ color }) => <Ionicons name="time" size={24} color={color} /> }}
        />
        <Tab.Screen name="Settings" component={SettingsScreen}
          options={{ tabBarIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} /> }}
        />
        <Tab.Screen name="Upgrade" component={PaywallScreen}
          options={{ tabBarIcon: ({ color }) => <Ionicons name="star" size={24} color={color} /> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
