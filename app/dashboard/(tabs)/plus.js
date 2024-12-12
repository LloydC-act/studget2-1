import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import supabase from '../../../utils/client';

const Transact = ({ onSwitch }) => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [errorMessage, setErrorMessage] = useState(''); // Error message state

  const items = [
    { label: 'Pay Bills', value: 'Pay Bills' },
    { label: 'Send Money', value: 'Send Money' },
    { label: 'Pay Fee', value: 'Pay Fee' },
  ];

  // Fetch wallet balance
  const fetchBalance = async () => {
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated.');

      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('balance')
        .eq('wallet_id', user.id)
        .single();

      if (walletError || !walletData) throw new Error('Failed to fetch wallet balance.');

      setBalance(walletData.balance);
    } catch (error) {
      console.error('Error fetching balance:', error.message);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Search for users
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a valid search query.');
      return;
    }

    try {
      const { data: users, error } = await supabase
        .from('profiles')
        .select('id, username, email')
        .ilike('username', `%${searchQuery}%`);

      if (error) throw new Error('Failed to search users.');

      if (users.length === 0) {
        setErrorMessage('No user found with that username.');
        setSelectedRecipient(null);  // Clear selected recipient
      } else {
        setErrorMessage('');
        const user = users[0];  // If a user is found, select the first one
        setSelectedRecipient(user);
        Alert.alert('Recipient found', `Recipient: ${user.username}. Proceeding with transaction.`);
        handleTransaction(user);  // Automatically proceed with the transaction
      }
    } catch (error) {
      console.error('Search Error:', error.message);
      Alert.alert('Error', error.message);
    }
  };

  const handleTransaction = async () => {
    if (!selectedValue) {
      Alert.alert('Error', 'Please select a purpose.');
      return;
    }
  
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount greater than 0.');
      return;
    }
  
    if (selectedValue === 'Send Money' && !selectedRecipient) {
      Alert.alert('Error', 'Please select a recipient.');
      return;
    }
  
    try {
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      if (userError || !currentUser) throw new Error('User not authenticated.');
  
      // Prevent sending money to yourself
      if (selectedValue === 'Send Money' && selectedRecipient?.id === currentUser.id) {
        Alert.alert('Error', 'You cannot send money to yourself.');
        return;
      }
  
      if (balance < parsedAmount) {
        Alert.alert('Error', 'Insufficient balance.');
        return;
      }
  
      // Prepare transaction data
      const transactionData = {
        wallet_id: currentUser.id,
        type: selectedValue,
        amount: parsedAmount,
        description: `Transaction for ${selectedValue}`,
        recipient_wallet_id: selectedRecipient?.id || null,
      };
  
      // Insert transaction (backend trigger will handle balance updates)
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert([transactionData]);
  
      if (transactionError) throw new Error('Failed to log the transaction.');
  
      // Success case: Update UI and reset fields
      setAmount('');
      setSelectedValue(null);
      setSearchQuery('');
      setSelectedRecipient(null);
  
      // Refetch balance to reflect the updated value
      await fetchBalance();
  
      Alert.alert('Success', `${selectedValue} transaction completed.`);
    } catch (error) {
      console.error('Transaction Error:', error.message);
      Alert.alert('Error', error.message);
    }
  };
  
  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.container2}>
        <Text style={styles.bal}>Account Balance</Text>
        <Text style={{ marginBottom: 20, fontSize: 34, color: '#fff' }}>
          {loading ? 'Loading...' : `₱ ${balance?.toLocaleString()}`}
        </Text>
      </View>
      <View style={styles.bot}>
        <Text style={styles.text}>Amount:</Text>
        <TextInput
          placeholder="Enter Amount"
          style={styles.input}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <Text style={styles.text}>Purpose:</Text>
        <RNPickerSelect
          onValueChange={(value) => setSelectedValue(value)}
          items={items}
          style={pickerSelectStyles}
          placeholder={{ label: 'Select a purpose...', value: null }}
          value={selectedValue}
        />
        {selectedValue === 'Send Money' && (
          <>
            <Text style={styles.text}>Search Recipient:</Text>
            <TextInput
              placeholder="Enter Username"
              style={styles.input}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.buttonText}>Search</Text>
            </TouchableOpacity>
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
          </>
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => handleTransaction()}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: -30,
  },
  container2: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#68409C',
    borderRadius: 25,
    width: '100%',
    height: '30%',
  },
  bal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  bot: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
    width: '100%',
    height: '60%',
  },
  text: {
    fontSize: 18,
    color: '#000',
  },
  input: {
    padding: 10,
    width: '90%',
    alignSelf: 'center',
    borderBottomWidth: 0.5,
    marginBottom: 5,
    fontSize: 18,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#6650A4',
    borderRadius: 50,
    width: '70%',
    justifyContent: 'center',
    marginVertical: 5,
    padding: 15,
  },
  buttonText: {
    color: '#fff',
  },
  searchButton: {
    alignItems: 'center',
    backgroundColor: '#6650A4',
    borderRadius: 50,
    width: '70%',
    justifyContent: 'center',
    marginVertical: 5,
    padding: 10,
    alignSelf: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
});

export default Transact;
