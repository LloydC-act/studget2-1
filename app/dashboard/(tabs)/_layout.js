import { View, Text } from 'react-native';
import React, { useMemo } from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons'; // Import the icon library

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
          title: 'Scan QR',
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons name={focused ? 'camera' : 'camera-outline'} size={24} color='balck' /> // Profile icon
          ),
        }} 
      />
    </Tabs>
  );
};

export default DashboardLayout;