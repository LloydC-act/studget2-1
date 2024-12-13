import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import supabase from '../utils/client';

const Recovery = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const router = useRouter();

  const handleCheckEmail = async () => {
    setMessage('');
    setError('');
    setIsEmailVerified(false);

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    try {
      // Call the RPC function to check if the email exists
      const { data, error } = await supabase.rpc('check_email_exists', {
        email_input: email,
      });

      if (error) {
        setError('Error checking email. Please try again.');
      } else if (!data) {
        setError('This email is not registered.');
      } else {
        setIsEmailVerified(true);
        setMessage('Email verified. You can now reset your password.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const handlePasswordReset = async () => {
    setMessage('');
    setError('');
  
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
  
    try {
      // Correctly call the resetPasswordForEmail method from supabase.auth
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `exp://192.168.18.240:8081/resetpass`, // For Android Device (replace with your local IP)
      });
  
      if (error) {
        // Log the error to the console for debugging purposes
        console.error('Password reset error:', error);
        setError('Failed to send password reset email. Please try again.');
      } else {
        setMessage('A password reset link has been sent to your email.');
      }
    } catch (err) {
      // Log the error to console for more information
      console.error('Unexpected error occurred:', err);
      setError('An unexpected error occurred. Please try again.');
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
        label="Email"
        mode="outlined"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        editable={!isEmailVerified} // Disable email input after verification
      />
      {!isEmailVerified ? (
        <Button mode="contained" style={styles.button} onPress={handleCheckEmail}>
          Verify Email
        </Button>
      ) : (
        <Button mode="contained" style={styles.button} onPress={handlePasswordReset}>
          Send Password Reset Link
        </Button>
      )}
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

export default Recovery;
