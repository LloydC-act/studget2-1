import { View, Text, StyleSheet } from 'react-native'
import React from 'react';
import { useRouter } from 'expo-router';
import { Button } from 'react-native-paper';

const Settings = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings</Text>
      <Button 
        mode="contained" 
        onPress={() => router.replace('/resetpass')}
        style={styles.button}
      >
        Reset Password
      </Button>
      <Button 
        mode="contained" 
        onPress={() => router.replace('/')}
        style={styles.button}
      >
        Logout
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    marginBottom: 10,
  }
});

export default Settings;
