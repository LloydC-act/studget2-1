import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { TextInput, Button, Text, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import supabase from '../utils/client';

const Login = () => {
  const router = useRouter();

  // State variables for email, password, error message, loading, and password visibility
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility

  const handleLogin = async () => {
  setError(''); // Clear previous error
  setLoading(true); // Set loading state

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
  if (!emailRegex.test(email)) {
    setError('Please enter a valid email address.');
    setLoading(false);
    return;
  }

  // Validate inputs
  if (!email || !password) {
    setError('Please enter both email and password.');
    setLoading(false);
    return;
  }

  // Attempt to log in the user
  const { data: user, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  setLoading(false); // Reset loading state

  if (loginError) {
    console.error("Login Error:", loginError); // Log the error for debugging

    // Display user-friendly error messages
    if (loginError.message.toLowerCase().includes('invalid')) {
      setError('Invalid email or password. Please try again.');
    } else {
      setError('An error occurred. Please try again later.');
    }
  } else {
    console.log("User logged in:", user); // Log user details

    // Fetch user data from the `profiles` table using user ID
    const { data: profileData, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.user.id) // Use user.id to fetch the profile data
      .single(); // Fetch the single record

    if (fetchError) {
      console.error("Fetch Profile Error:", fetchError); // Log fetch error
      setError(fetchError.message); // Handle error if fetching profile data fails
    } else {
      console.log("Profile data:", profileData); // Log profile data
      // Navigate to the dashboard after successful login
      router.replace('dashboard');
    }
  }
};

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
        secureTextEntry={!showPassword} // Toggle password visibility
        style={styles.input}
        value={password}
        onChangeText={setPassword} // Update password state
        textContentType="password" // iOS specific
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowPassword(!showPassword)} // Toggle show/hide password
          />
        }
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
        <Text style={styles.linkText} onPress={() => router.push('Recovery')}>
          Forgot Password?
        </Text>
      </View>
      <View style={styles.footer}>
        <Text>Doesn't have an account? </Text>
        <Text style={styles.linkText} onPress={() => router.push('Register')}>
          Sign up
        </Text>
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
    backgroundColor: '#BA75D2',
  },
  header: {
    alignItems: 'center',
    marginTop: -20,
  },
  recoveryText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  input: {
    marginBottom: 16,
    width: '90%',
    alignSelf: 'center',
  },
  button: {
    width: 180,
    alignSelf: 'center',
    marginBottom: 5,
  },
  h1: {
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  linkText: {
    color: '#fff',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
  logo: {
    width: 285,
    height: 189,
  },
});

export default Login;
