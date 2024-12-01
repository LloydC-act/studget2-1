import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ImageBackground, TouchableOpacity } from 'react-native';

const backgroundImage = require('./bg.gif');
const Auth = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (isSignIn) {
      Alert.alert('Your in', `Email: ${email}, Password: ${password}`);
    } else {
      Alert.alert('Registered', `Email: ${email}, Password: ${password}`);
    }
    setEmail('');
    setPassword('');
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.container}>
      <Text style={styles.title}>{isSignIn ? 'Sign In' : 'Sign Up'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{isSignIn ? 'Login' : 'Register'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setIsSignIn(!isSignIn)}>
          <Text style={styles.buttonText}>{isSignIn ? 'Sign Up' : 'Sign In'}</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    color: 'white',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  buttonContainer: {
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 9, 
    paddingHorizontal: 5, 
    borderRadius: 5, 
    alignItems: 'center', 
  },
  buttonText: {
    color: 'white', 
    fontSize: 16, 
  },
});

export default Auth;