import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useRouter } from 'expo-router';
import { supabase } from '../utils/client';

const CashIn = () => {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWalletData = async () => {
    try {
      setLoading(true);

      // Fetch the authenticated user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error('Error fetching user:', userError);
        Alert.alert('Error', 'Could not fetch user details.');
        return;
      }

      if (user) {
        // Fetch wallet data
        const { data, error } = await supabase
          .from('wallets')
          .select('wallet_id, balance, currency')
          .eq('wallet_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching wallet data:', error);
          Alert.alert('Error', 'Could not fetch wallet data.');
          return;
        }

        setWalletData(data);
      } else {
        console.error('No authenticated user found.');
        Alert.alert('Error', 'No authenticated user found.');
      }
    } catch (error) {
      console.error('Unexpected error fetching wallet data:', error);
      Alert.alert('Error', 'Unexpected error occurred while fetching wallet data.');
    } finally {
      setLoading(false);
    }
  };

  const handleCashIn = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid amount to cash in.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('wallets')
        .update({
          balance: supabase.raw('balance + ?', [parseFloat(amount)]),
          updated_at: new Date().toISOString(),
        })
        .eq('wallet_id', walletData.wallet_id);

      if (error) {
        throw error;
      }

      if (data) {
        Alert.alert('Success', `You have successfully cashed in ₱${amount}`);
        setAmount('');
        fetchWalletData();
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.goBackButton} onPress={() => router.replace('dashboard')}>
        <Feather name="arrow-left" size={30} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>Cash In</Text>
      {walletData && (
        <>
          <Text style={styles.info}>Wallet ID: {walletData.wallet_id}</Text>
          <Text style={styles.info}>Balance: ₱{walletData.balance.toFixed(2)}</Text>
          <Text style={styles.info}>Currency: {walletData.currency}</Text>
        </>
      )}
      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={(text) => setAmount(text)}
      />
      <TouchableOpacity style={styles.cashInButton} onPress={handleCashIn}>
        <Text style={styles.buttonText}>Cash In</Text>
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
    marginBottom: 10,
    color: '#333',
  },
  info: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  cashInButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CashIn;
