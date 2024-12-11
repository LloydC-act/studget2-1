import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ToastAndroid, Image} from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import supabase from '../utils/client';

const Register = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    setEmailError(validateEmail(value) ? '' : 'Please enter a valid email');
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    setPasswordError(value.length < 6 ? 'Password must be at least 6 characters' : '');
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    if (value.length < 6) {
      setConfirmPasswordError('Password must be at least 6 characters');
    } else if (value !== password) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  };

  const validateFields = () => {
    if (!name || !idNumber || !phoneNumber || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return false;
    }
    if (emailError || passwordError || confirmPasswordError) {
      setError('Please fix the errors before submitting');
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateFields()) return;
  
    try {
      // Sign up the user in Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name, // Optional metadata
            phone: phoneNumber,
          },
        },
      });
  
      if (signUpError) {
        // Handle email already registered
        if (signUpError.message.includes('already registered')) {
          setError('This email is already registered. Please use a different email.');
        } else {
          setError(signUpError.message);
        }
        return;
      }
  
      // Get the user ID from the authData
      const userId = authData.user.id; // This is the UUID you need
  
      // Insert user data into the `profiles` table
      const { data, error: insertError } = await supabase.from('profiles').insert([
        {
          id: userId, // Use the user ID here
          student_id: idNumber,
          username: name,
          phone: phoneNumber,
          email: email,
        },
      ]);
  
      if (insertError) {
        // Check for database constraint violations (e.g., unique violations)
        if (insertError.message.includes('duplicate key value')) {
          setError('ID number, phone number, or email already exists. Please use unique values.');
        } else {
          setError(insertError.message);
        }
      } else {
        console.log('User  registered successfully:', data);
        ToastAndroid.show('Registration successful!', ToastAndroid.SHORT); // Show success message
        router.replace('Login'); // Navigate to Login
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again later.');
      console.error('Error during registration:', error);
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
        <Text variant="headlineMedium" style={styles.registerText}>Create an account</Text>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TextInput label="Name" mode="outlined" style={styles.input} value={name} onChangeText={setName} />
      <TextInput label="ID number" mode="outlined" style={styles.input} value={idNumber} onChangeText={setIdNumber} />
      <TextInput label="Phone number" mode="outlined" style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} />
      <TextInput 
        label="Email" 
        mode="outlined" 
        style={styles.input} 
        value={email} 
        onChangeText={handleEmailChange} 
        error={!!emailError}
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      <TextInput 
        label="Password" 
        mode="outlined" secureTextEntry 
        style={styles.input} 
        value={password} 
        onChangeText={handlePasswordChange} 
        error={!!passwordError}
      />
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
      <TextInput 
        label="Confirm Password" 
        mode="outlined" 
        secureTextEntry 
        style={styles.input} 
        value={confirmPassword} 
        onChangeText={handleConfirmPasswordChange} 
        error={!!confirmPasswordError}
      />
      {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
      <Button mode="contained" style={styles.button} onPress={handleSignUp}>
        Sign Up
      </Button>
      <View style={styles.footer}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.replace('Login')}>
          <Text style={styles.linkText}>Login</Text>
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
    backgroundColor:'#BA75D2'
  },
  header: {
    alignItems: 'center', 
    marginTop: -20
  },
  registerText: {
    fontWeight: 'bold', 
    color: '#fff'
  },
  input: {
    marginBottom: 16,
    width: 250, 
    alignSelf: 'center', 
  },
  button: {
    marginBottom: 16,
    width: 120, 
    alignSelf: 'center', 
  },
  h1: {
    alignItems: 'center', 
    flexDirection: 'row',
  },
  loginText: {
    fontSize: 56,
    fontWeight: 'bold',
  },
  logText: {
    fontSize: 35,
    fontWeight : 'bold',
  },
  footer: {
    flexDirection: 'row',
  },
  linkText: {
    color: '#fff', // Change to your preferred link color
    textDecorationLine: 'underline', // Underline for the link
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

export default Register;