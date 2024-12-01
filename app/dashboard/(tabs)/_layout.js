import { View, Text } from 'react-native';
import React, { useMemo } from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Import the icon library

const DashboardLayout = () => {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen 
        name="index" 
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons name={focused ? 'home' : 'home-outline'} size={24} color='balck' /> // Home icon
          ),
        }} 
      />
      <Tabs.Screen 
        name="plus" 
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons name={focused ? 'send' : 'send-outline'} size={24} color='balck' /> // Profile icon
          ),
        }} 
      />
      <Tabs.Screen 
        name="Settings" 
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons name= {focused ? 'cog' : 'cog-outline'} size={24} color='balck' /> // Settings icon
          ),
        }} 
      />
    </Tabs>
  );
};

export default DashboardLayout;