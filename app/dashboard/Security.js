import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication'; // For biometric auth (Expo)

const Security = () => {
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [pinEnabled, setPinEnabled] = useState(false);

  // Function to handle biometric authentication
  const handleBiometricAuth = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const supported = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !supported) {
      Alert.alert('Error', 'Biometric authentication is not supported on this device.');
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate with Biometrics',
      fallbackLabel: 'Enter PIN instead',
    });

    if (result.success) {
      Alert.alert('Success', 'Biometric authentication successful!');
    } else {
      Alert.alert('Failed', 'Biometric authentication failed.');
    }
  };

  // Function to toggle biometric authentication
  const toggleBiometric = () => {
    if (!biometricEnabled) {
      handleBiometricAuth();
    }
    setBiometricEnabled(!biometricEnabled);
  };

  // Function to toggle PIN authentication
  const togglePin = () => {
    if (!pinEnabled) {
      // Navigate to set up PIN (e.g., using a navigation stack)
      Alert.alert('Set PIN', 'Navigate to PIN setup screen.');
    }
    setPinEnabled(!pinEnabled);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Security Settings</Text>

      {/* Biometric Authentication */}
      <View style={styles.setting}>
        <Text style={styles.label}>Enable Biometric Authentication</Text>
        <Switch value={biometricEnabled} onValueChange={toggleBiometric} />
      </View>

      {/* PIN Authentication */}
      <View style={styles.setting}>
        <Text style={styles.label}>Enable PIN Authentication</Text>
        <Switch value={pinEnabled} onValueChange={togglePin} />
      </View>

      {/* Test Biometric Authentication */}
      {biometricEnabled && (
        <TouchableOpacity style={styles.button} onPress={handleBiometricAuth}>
          <Text style={styles.buttonText}>Test Biometric Authentication</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#D9D9FF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  label: {
    fontSize: 18,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Security;
