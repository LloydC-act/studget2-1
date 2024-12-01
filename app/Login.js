import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useRouter } from 'expo-router'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import supabase from '../utils/client';

const Login = () => {
  const router = useRouter();
  
  // State variables for email, password, error message, and loading state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Clear previous error
    setError('');
    
    // Validate inputs
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    // Attempt to log in the user
    setLoading(true); // Set loading state
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false); // Reset loading state

    if (loginError) {
      setError(loginError.message); // Set error message if login fails
    } else {
      console.log("User  logged in:", data);
      router.replace('dashboard'); // Navigate to the dashboard after successful login
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.h1}>
        <Text variant="displayLarge" style={styles.loginText}>STUD</Text>
        <Text variant="displayLarge" style={styles.logText}>GET</Text>
      </View>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.recoveryText}>Login</Text>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TextInput 
        label="Email" 
        mode="outlined" 
        style={styles.input} 
        value={email}
        onChangeText={setEmail} // Update email state
        autoCompleteType="email" // Suggest email input
        keyboardType="email-address" // Keyboard type for email
        textContentType="emailAddress" // iOS specific
      />
      <TextInput 
        label="Password" 
        mode="outlined" 
        secureTextEntry 
        style={styles.input} 
        value={password}
        onChangeText={setPassword} // Update password state
        textContentType="password" // iOS specific
      />
      <Button 
        mode="contained" 
        style={styles.button} 
        onPress={handleLogin} // Call handleLogin on button press
        disabled={loading} // Disable button while loading
      >
        {loading ? <ActivityIndicator color="#fff" /> : 'Login'} {/* Show loading indicator */}
      </Button>
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.push('Recovery')}>
          <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <Text>Doesn't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('Register')}>
          <Text style={styles.linkText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

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
    width: '90%',
    alignSelf: 'center', 
  },
  button: {
    width: 180, 
    alignSelf: 'center', 
    marginBottom: 5
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
    marginBottom: 5
  },
  linkText: {
    color: '#fff', // Change to your preferred link color
    textDecorationLine: 'underline', // Underline for the link
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
});

export default Login;