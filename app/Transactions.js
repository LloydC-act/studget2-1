import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useRouter } from 'expo-router';
import supabase from '../utils/client';

const Transactions = () => {
  const router = useRouter();
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch recipient's name based on wallet_id
  const fetchRecipientName = async (walletId) => {
    // Check if walletId is null or undefined
    if (!walletId) {
      console.error('Invalid walletId:', walletId);
      return 'Unknown Recipient'; // Handle case where walletId is invalid
    }

    try {
      // Query the 'profiles' table to fetch recipient's username based on wallet_id
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', walletId)
        .single();

      if (error || !data) {
        console.error('Error fetching recipient name:', error);
        return 'Unknown Recipient'; // Return fallback value if no user is found
      }

      return data.username; // Return the recipient's username
    } catch (err) {
      console.error('Error fetching recipient name:', err);
      return 'Unknown Recipient';
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      // Fetch the current authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        Alert.alert('Error', 'User is not authenticated.');
        return;
      }

      const userId = user.id;

      // Fetch transactions where the user is the sender
      const { data: sentData, error: sentError } = await supabase
        .from('transactions')
        .select('*')
        .eq('wallet_id', userId)
        .order('created_at', { ascending: false });

      // Fetch notifications where the user is the recipient
      const { data: receivedData, error: receivedError } = await supabase
        .from('notifications')
        .select('*')
        .eq('wallet_id', userId)
        .order('created_at', { ascending: false });

      if (sentError || receivedError) {
        console.error('Error fetching transactions and notifications:', sentError, receivedError);
        Alert.alert('Error', 'Failed to load transactions and notifications. Please try again.');
        return;
      }

      // Process transactions and notifications
      const updatedTransactions = await Promise.all(
        sentData.map(async (transaction) => {
          const recipientName = await fetchRecipientName(transaction.recipient_wallet_id);
          return {
            ...transaction,
            recipientName,
            isReceived: false, // Mark as 'sent' transaction
          };
        })
      );

      const notificationData = receivedData.map((notification) => ({
        ...notification,
        isReceived: true, // Mark as 'received' notification
      }));

      // Combine transactions and notifications
      const allData = [...updatedTransactions, ...notificationData];
      allData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setTransactions(allData);
    } catch (err) {
      console.error('Error fetching transactions and notifications:', err);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchWalletData = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      // Fetch wallet balance
      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('balance')
        .eq('wallet_id', user.id)
        .single();

      if (walletError || !walletData) {
        throw new Error('Failed to fetch wallet balance');
      }

      setBalance(walletData.balance);
    } catch (error) {
      console.error('Error fetching wallet data:', error.message);
      Alert.alert('Error', 'Unable to fetch wallet data. Please try again.');
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.container2}>
        <TouchableOpacity style={styles.goBackButton} onPress={() => router.replace('dashboard')}>
          <Feather name="arrow-left" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.bal}>Account Balance</Text>
        <Text style={{ marginBottom: 20, fontSize: 34, color: '#fff' }}>
          {balance !== null ? `₱ ${balance.toLocaleString()}` : 'Loading...'}
        </Text>
        <View style={styles.info}>
          <Feather name="arrow-up-left" size={40} color="#fff" borderRadius={50} justifyContent="center" />
          <View style={styles.Income}>
            <Text style={styles.in}>Income</Text>
            <Text style={styles.word}>₱ 123,456</Text>
          </View>
          <TouchableOpacity>
            <Feather name="arrow-down-right" size={40} color="#fff" borderRadius={50} justifyContent="center" />
          </TouchableOpacity>
          <View style={styles.Expenses}>
            <Text style={styles.in}>Expenses</Text>
            <Text style={styles.word}>₱ 67,890</Text>
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.mid}>
          <Text style={styles.headerText}>Transactions</Text>
        </View>
        <ScrollView style={styles.transactionList}>
          {loading ? (
            <Text style={styles.infoText}>Loading transactions and notifications...</Text>
          ) : transactions.length === 0 ? (
            <Text style={styles.infoText}>No transactions or notifications available.</Text>
          ) : (
            transactions.map((item) => (
              <View
                key={item.transaction_id || item.notification_id}
                style={[
                  styles.transactionCard,
                  item.isReceived ? { backgroundColor: '#f0f0f0' } : null,
                ]}
              >
                <Text style={styles.transactionType}>
                  {item.isReceived ? 'Money Receive' : item.type}
                </Text>
                {!item.isReceived && (
                  <Text style={styles.transactionRecipient}>
                    Recipient: {item.recipientName || 'Unknown'}
                  </Text>
                )}
                <Text style={styles.transactionDescription}>
                  {item.isReceived ? item.message : item.description || 'No description provided'}
                </Text>
                <Text style={styles.transactionDate}>
                  Date: {new Date(item.created_at).toLocaleString()}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  goBackButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 1,
  },
  container2: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#68409C',
    borderRadius: 25,
    width: '100%',
    height: '40%',
    marginTop: -20,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    color: '#fff',
  },
  Income: {
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 60,
    marginLeft: 10,
  },
  Expenses: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 10,
  },
  bal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  in: {
    fontSize: 16,
    color: '#fff',
  },
  word: {
    fontSize: 16,
    color: '#fff',
  },
  headerText: {
    color: '#000',
    fontSize: 18,
    marginHorizontal: 100,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    alignItems: 'center'
  },
  transactionList: {
    marginTop: 20,
  },
  transactionCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  transactionType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  transactionAmount: {
    fontSize: 16,
    color: '#333',
  },
  transactionRecipient: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  transactionDescription: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  transactionDate: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default Transactions;
