import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import supabase from '../utils/client'; // Adjust the import path as needed

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Fetch authenticated user ID
    const fetchUserId = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error('Error fetching user:', error);
      } else {
        setUserId(user?.id);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (userId) {
        try {
          // Fetch budget notifications
          const { data: budgetData, error: budgetError } = await supabase
            .from('budgets') // Ensure the table name is correct
            .select('*')
            .eq('profile_id', userId);

          if (budgetError) {
            console.error('Error fetching budgets:', budgetError);
          }

          const today = new Date();
          const upcomingBudgetNotifications =
            budgetData?.filter((item) => {
              const dueDate = new Date(item.end_date);
              const timeDifference = (dueDate - today) / (1000 * 60 * 60 * 24); // Difference in days
              return timeDifference <= 3 && timeDifference >= 0; // Within 3 days
            }) || [];

          // Fetch money-received notifications
          const { data: moneyData, error: moneyError } = await supabase
            .from('notifications') // Ensure the table name matches your schema
            .select('*')
            .eq('wallet_id', userId);

          if (moneyError) {
            console.error('Error fetching money notifications:', moneyError);
          }

          // Merge notifications
          const mergedNotifications = [
            ...upcomingBudgetNotifications.map((item) => ({
              id: item.id,
              type: 'budget',
              name: item.name,
              date: item.end_date,
              amount: `₱${item.amount}`,
              message: `Budget "${item.name}" is due on ${item.end_date}.`,
            })),
            ...moneyData.map((item) => ({
              id: item.notification_id,
              type: 'money',
              name: 'Money Received',
              date: item.created_at,
              amount: '',
              message: item.message,
            })),
          ];

          setNotifications(mergedNotifications);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      }
    };

    fetchNotifications();
  }, [userId]);

  return (
    <View style={styles.container}>
      <ScrollView>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <View key={notification.id} style={styles.notificationItem}>
              <Text style={styles.name}>{notification.name}</Text>
              <Text style={styles.message}>{notification.message}</Text>
              {notification.date && (
                <Text style={styles.date}>Date: {notification.date}</Text>
              )}
              {notification.amount && (
                <Text style={styles.amount}>Amount: {notification.amount}</Text>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.noNotifications}>No upcoming notifications.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3498db',
  },
  notificationItem: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 14,
    color: '#666',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  amount: {
    fontSize: 14,
    color: '#666',
  },
  noNotifications: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Notifications;
