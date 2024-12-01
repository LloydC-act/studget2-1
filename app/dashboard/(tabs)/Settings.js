import { View, Text } from 'react-native'
import React, { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { Button } from 'react-native-paper';

const Settings = () => {
  const router = useRouter();

  return (
    <View>
      <Text>Settings</Text>
      <Button mode="contained" onPress={() => router.replace('/')}>Logout</Button>
    </View>
  )
}

export default Settings