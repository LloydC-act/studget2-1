import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useRouter } from 'expo-router';
import supabase from '../utils/client';

const CashIn = () => {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [profileId, setProfileId] = useState(null);

  // Fetch the profile ID and student information
  const fetchStudentInfo = async () => {
    try {
      // Fetch the current authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        Alert.alert('Error', 'User is not authenticated.');
        return;
      }

      const userId = user.id;

      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('wallet_id')
        .eq('wallet_id', userId)
        .single();

      if (walletError || !walletData) {
        Alert.alert('Error', 'Failed to fetch wallet information.');
        return;
      }

      setProfileId(walletData.wallet_id);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('student_id')
        .eq('id', walletData.wallet_id)
        .single();

      if (profileError || !profileData) {
        Alert.alert('Error', 'Failed to fetch student information.');
        return;
      }

      setStudentId(profileData.student_id);
    } catch (err) {
      console.error('Error fetching student information:', err);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  useEffect(() => {
    fetchStudentInfo(); // Fetch student information when the component mounts
  }, []);

  const handleCashIn = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid cash-in amount.');
      return;
    }

    if (!profileId) {
      Alert.alert('Error', 'Profile ID is not available.');
      return;
    }

    try {
      setLoading(true);

      // Insert transaction into the transactions table
      const { data, error } = await supabase.from('transactions').insert([
        {
          wallet_id: profileId,
          type: 'Cash In',
          amount: parseFloat(amount),
          description: `Cash-in transaction for Student ID: ${studentId}`
        }
      ]);

      if (error) {
        console.error('Cash-in transaction error:', error);
        Alert.alert('Error', 'Transaction failed. Please try again.');
        return;
      }

      Alert.alert('Success', `Cash-in of PHP ${amount} was successful for Student ID: ${studentId}!`);
      setAmount(''); // Clear the input
      router.replace('dashboard'); // Navigate back to the dashboard
    } catch (err) {
      console.error('Cash-in error:', err);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.goBackButton} onPress={() => router.replace('dashboard')}>
        <Feather name="arrow-left" size={30} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title}>Cash-In</Text>
      {studentId ? (
        <Text style={styles.infoText}>Student ID: {studentId}</Text>
      ) : (
        <Text style={styles.infoText}>Loading student information...</Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Enter Amount (PHP)"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TouchableOpacity
        style={styles.cashInButton}
        onPress={handleCashIn}
        disabled={loading}
      >
        <Text style={styles.cashInButtonText}>{loading ? 'Processing...' : 'Cash In'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D9D9FF',
    paddingHorizontal: 20,
  },
  goBackButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 18,
    marginBottom: 20,
  },
  cashInButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  cashInButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CashIn;
