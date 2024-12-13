import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import supabase from '../utils/client';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(true); // Automatically assume user is verified
  const router = useRouter();

  const handlePasswordReset = async () => {
    setMessage('');
    setError('');

    if (!password || !confirmPassword) {
      setError('Please fill out both password fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!isEmailVerified) {
      setError('Please verify your email first.');
      return;
    }

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        Alert.alert('Error', 'User is not authenticated.');
        return;
      }

      // Update password for the logged-in user
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage('Your password has been updated successfully.');
        setTimeout(() => {
          router.replace('Login'); // Redirect to login page after success message is shown
        }, 2000); // 2 seconds delay before navigating
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.h1}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.recoveryText}>
          Reset Your Password
        </Text>
      </View>
      <TextInput
        label="New Password"
        mode="outlined"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        label="Confirm Password"
        mode="outlined"
        style={styles.input}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <Button mode="contained" style={styles.button} onPress={handlePasswordReset}>
        Reset Password
      </Button>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {message ? <Text style={styles.successText}>{message}</Text> : null}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.replace('Login')}>
          <Text style={styles.linkText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    flexDirection: 'row',
  },
  footer: {
    flexDirection: 'row',
  },
  linkText: {
    color: '#fff',
    textDecorationLine: 'underline',
  },
  logo: {
    width: 285,
    height: 189,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 8,
  },
  successText: {
    color: 'green',
    textAlign: 'center',
    marginBottom: 8,
  },
});

export default ResetPassword;
