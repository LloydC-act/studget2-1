
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { View, StyleSheet,TouchableOpacity } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';

const Recovery = () => {
  const router = useRouter();

  return(
  <View style={styles.container}>
    <View style={styles.h1}>
    <Text variant="displayLarge" style={styles.loginText}>STUD</Text>
    <Text variant="displayLarge" style={styles.logText}>GET</Text>
    </View>
    <View style={styles.header}>
      <Text variant="headlineMedium" style={styles.recoveryText}>Can't access your account?      </Text>
    </View>
    <TextInput label="Username, or email" mode="outlined" style={styles.input} />
    <Button mode="contained" style={styles.button} onPress={() => {console.log("Recovery")}}>
      Send Recovery Link
    </Button>
    <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.replace('Login')}>
          <Text style={styles.linkText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
  </View>
)};

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
  },
  recoveryText: {
    fontWeight: 'bold',
    color: '#fff' 
  },
  input: {
    marginBottom: 16,
    width: 300, 
    alignSelf: 'center',
  },
  button: {
    marginBottom: 16,
    width: 250, 
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
  footer: {
    flexDirection: 'row',
  },
  linkText: {
    color: '#fff', // Change to your preferred link color
    textDecorationLine: 'underline', // Underline for the link
  },
});

export default Recovery;
