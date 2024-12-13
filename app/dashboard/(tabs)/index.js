import React, { useState, useEffect  } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { useRouter } from 'expo-router';
import { BarChart, Grid } from "react-native-chart-kit";
import { MaterialIcons } from '@expo/vector-icons';
import supabase from '../../../utils/client';

const index = () => {
  
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(0); // 0 = January, 1 = February, etc.
  const [balance, setBalance] = useState(null); // Store the wallet balance
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  

  const [hasNewNotification, setHasNewNotification] = useState(false);

  const checkForNewNotifications = async () => {
    try {
      // Fetch the current authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('Error fetching user:', userError);
        return;
      }
  
      // Fetch the user's unread notifications (read = false)
      const { data: notifications, error: notificationsError } = await supabase
        .from('notifications')
        .select('*')
        .eq('wallet_id', user.id)
        .eq('read', false);  // Check for unread notifications
  
      if (notificationsError) {
        console.error('Error fetching notifications:', notificationsError);
        return;
      }
  
      // Update the hasNewNotification state based on the number of unread notifications
      setHasNewNotification(notifications.length > 0); // Set to true if there are any unread notifications
    } catch (error) {
      console.error('Error checking for new notifications:', error);
    }
  };
  
  useEffect(() => {
    fetchTransactions();
    checkForNewNotifications();
  }, []);


  const data = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        data: [800, 1200, 1500, 2000],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    barPercentage: 0.5,
    decimalPlaces: 0,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  // Fetch the wallet balance
  const fetchWalletBalance = async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("User not authenticated");
      }

      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('balance')
        .eq('wallet_id', user.id) // Match the wallet ID with the authenticated user ID
        .single();

      if (walletError || !walletData) {
        throw new Error('Failed to fetch wallet balance');
      }

      setBalance(walletData.balance); // Update state with the fetched balance
    } catch (error) {
      console.error('Error fetching wallet balance:', error.message);
      Alert.alert('Error', 'Unable to fetch wallet balance. Please try again.');
    }
  };

  useEffect(() => {
    fetchWalletBalance(); // Fetch wallet balance on component mount
  }, []);
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

      // Fetch transactions for the user's wallet
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('wallet_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        Alert.alert('Error', 'Failed to load transactions. Please try again.');
        return;
      }

      setTransactions(data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <View style={styles.container}>
     <View style={styles.container2}>
      <View style={styles.iconTextContainer}>
        <Text style={styles.text}>Welcome Back!</Text>
        <TouchableOpacity onPress={() => router.push('notifications')}>
          <View style={styles.bellIcon}>
            <Icon name="bell" size={30} color="#fff" />
            {hasNewNotification && (
              <View style={styles.newNotificationDot} />
            )}
          </View>
        </TouchableOpacity>
      </View >
      <Text style={styles.bal}>Account Balance</Text>
        <View style={styles.transact}>
          <Text style={{ fontSize: 34, color: '#fff' }}>
            {balance !== null ? `₱ ${balance.toLocaleString()}` : 'Loading...'}
          </Text>
      <TouchableOpacity style={styles.button} onPress={() => router.replace('cashin')}>
      <Feather name="plus-circle" size={35} color="#000" />
        <Text style={styles.buttonText1}>Cash In</Text>
      </TouchableOpacity>
      </View>
      <View style={styles.info}>
          <Feather name="arrow-up-left" size={40} color="#fff" borderRadius={50} justifyContent="center"/>
        <View style={styles.Income}>
          <Text style={styles.in}>Income</Text>
          <Text style={styles.word}>₱ 123,456</Text>
        </View>
        <TouchableOpacity>
          <Feather name="arrow-down-right" size={40} color="#fff" borderRadius={50} justifyContent="center"/>
        </TouchableOpacity>
        <View style={styles.Expenses}>
          <Text style={styles.in}>Expenses</Text>
          <Text style={styles.word}>₱ 67,890</Text>
        </View>
      </View>
      </View>
      <View style={styles.container3}>
      
      <View style={styles.monthContainer}>
      <TouchableOpacity onPress={() => setCurrentMonth((currentMonth - 1 + 12) % 12)}>
        <MaterialIcons name="arrow-back-ios" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.monthText}>{months[currentMonth]}</Text>
      <TouchableOpacity onPress={() => setCurrentMonth((currentMonth + 1) % 12)}>
        <MaterialIcons name="arrow-forward-ios" size={24} color="#000" />
      </TouchableOpacity>
      </View>

      <BarChart
        data={data}
        width={Dimensions.get('window').width - 32}
        height={220}
        chartConfig={chartConfig}
        verticalLabelRotation={0}
        fromZero
      />
    </View>

      <View style={styles.mid}>
        <Text style={styles.buttonText}>Transactions</Text>
      <TouchableOpacity onPress={() => router.replace('Transactions')}>
        <Text style={styles.buttonText}>See all</Text>
      </TouchableOpacity>
      </View>
      <ScrollView style={styles.transactionList}>
        {loading ? (
          <Text style={styles.infoText}>Loading transactions...</Text>
        ) : transactions.length === 0 ? (
          <Text style={styles.infoText}>No transactions available.</Text>
        ) : (
          transactions.map((transaction) => (
            <View key={transaction.transaction_id} style={styles.transactionCard}>
              <Text style={styles.transactionType}>{transaction.type}</Text>
              <Text style={styles.transactionAmount}>
                Amount: PHP {transaction.amount.toFixed(2)}
              </Text>
              <Text style={styles.transactionDescription}>
                {transaction.description || 'No description provided'}
              </Text>
              <Text style={styles.transactionDate}>
                Date: {new Date(transaction.created_at).toLocaleString()}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', 
    alignItems: 'center',
    marginTop: -20,
  },
  container2: {
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#68409C',
    borderRadius: 25,
    width: '100%',
    height: '33%',
  },
  container3: {
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
    height: '30%',
    marginTop: 30,
    marginBottom: 20,
  },
  transact: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    width: '100%',
    justifyContent: 'space-between',
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '10%'
  },
  text: {
    marginRight: 150, 
    marginLeft: 0,
    fontSize: 24,
    color: '#fff'
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
    marginLeft: 10
  },
  Expenses: {
    flexDirection: 'column',
    alignItems: 'center', 
    marginLeft: 10
  },
  bal:{
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: -30
  },
  in:{
    fontSize: 16,
    color: '#fff'
  },
  word:{
    fontSize: 16,
    color: '#fff'
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  mid: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    height: '3%'
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    marginHorizontal: 100,
    textDecorationLine: 'underline',
    fontWeight: 'bold'
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 3,
    borderRadius: 50,
    width: '27%',
    justifyContent: 'center',
    marginVertical: 5
  },
  buttonText1: {
    color: '#000',
    fontSize: 18
  },
  monthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
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
  bellIcon: {
    position: 'relative',
  },
  newNotificationDot: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
  },
  
});


export default index;