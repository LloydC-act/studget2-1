import React, { useMemo } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router'; 


const Landing = () => {
  const router = useRouter();


  return (
  <SafeAreaView style={styles.container}>
    <View style={styles.h1}>
    <Image
        source={require('../assets/logo.png')} 
        style={styles.logo}
        resizeMode="contain" 
      />
    </View>
    <View style={styles.header}>
      <Text variant="headlineMedium" style={styles.recoveryText}>Best way to save your money.</Text>
    </View>
    <Button 
        mode="contained" 
        style={styles.button} 
        onPress={() => router.replace('Login')}
      >
        Let's get started
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
    marginTop: -30
  },
  recoveryText: {
    fontSize: 15,
    color: '#fff' 
  },
  h1: {
    alignItems: 'center', 
  },
  button: {
    marginBottom: 10,
    width: '45%', 
    alignSelf: 'center', 
  },
  logo: {
    width: 285, 
    height: 189,
    marginBottom: 5
  },
});

export default Landing;
