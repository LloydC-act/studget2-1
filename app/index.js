import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router'; 


const Landing = () => {
  const router = useRouter();


  return (
  <SafeAreaView style={styles.container}>
    <View style={styles.h1}>
    <Text variant="displayLarge" style={styles.loginText}>STUD</Text>
    <Text variant="displayLarge" style={styles.logText}>GET</Text>
    </View>
    <View style={styles.header}>
      <Text variant="headlineMedium" style={styles.recoveryText}>Best way to save your money.</Text>
    </View>
    <View style={styles.h1}>
      <Text variant="headlineMedium" style={styles.recoveryText}>Let's get started...</Text>
    </View>
    <Button 
        mode="contained" 
        style={styles.button} 
        onPress={() => router.replace('Login')}
      >
        Login
      </Button>
      <Button 
        mode="text" 
        onPress={() => router.push('Register')} // Navigate to Register screen
      >
        Sign Up
      </Button>
  </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor:'#BA75D2'
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
    marginTop: -40
  },
  recoveryText: {
    fontSize: 12,
    color: '#fff' 
  },
  h1: {
    marginBottom: -9,
    marginRight: 60
  },
  input: {
    marginBottom: 10,
    width: 300, 
    alignSelf: 'center',
  },
  button: {
    marginBottom: 10,
    width: 150, 
    alignSelf: 'center', 
  },
  h1: {
    alignItems: 'center', 
    marginBottom: 20,
    flexDirection: 'row',
},
loginText: {
    fontSize: 56,
    fontWeight: 'bold',
  },
  logText: {
    fontSize: 35,
    fontWeight: 'bold',
  },
});

export default Landing;
