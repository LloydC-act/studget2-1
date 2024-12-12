import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity, Alert, Platform, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import supabase from '../../utils/client'; // Adjust the import path as needed

const BudgetPlanner = () => {
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false); // Control for the date picker
  const [budget, setBudget] = useState('');
  const [userId, setUserId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false); // State to control form visibility

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
        setUserId(user?.id); // Set the authenticated user's ID
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    // Fetch budget data for the authenticated user
    const fetchBudgetData = async () => {
      if (userId) {
        try {
          const { data, error } = await supabase
            .from('budgets') // Correct table name 'budgets'
            .select('*')
            .eq('profile_id', userId);

          if (error) {
            console.error('Error fetching budget data:', error);
          } else {
            setExpenses(data || []);
          }
        } catch (error) {
          console.error('Error fetching budget data:', error);
        }
      }
    };

    fetchBudgetData();
  }, [userId]);

  const handleAddExpense = async () => {
    if (name && date && budget && userId) {
      try {
        const { error } = await supabase.rpc('insert_budget', {
          p_profile_id: userId, // Authenticated user's ID
          p_name: name,
          p_amount: parseFloat(budget),
          p_end_date: date.toISOString().split('T')[0], // Format date for SQL
        });

        if (error) {
          Alert.alert('Error', error.message);
        } else {
          Alert.alert('Success', 'Expense added successfully!');
          setName('');
          setDate(new Date());
          setBudget('');
          // Re-fetch budget data to update the list
          const { data, error } = await supabase
            .from('budgets') // Correct table name 'budgets'
            .select('*')
            .eq('profile_id', userId);

          setExpenses(data || []);
        }
      } catch (error) {
        console.error('Error inserting budget:', error);
        Alert.alert('Error', 'Failed to add expense. Please try again.');
      }
    } else {
      Alert.alert('Error', 'Please fill in all fields.');
    }
  };

  // Function to handle deleting an expense
  const deleteExpense = async (id) => {
    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id);

      if (error) {
        Alert.alert('Error', 'Failed to delete expense');
      } else {
        // Re-fetch expenses to reflect the changes
        const { data, error } = await supabase
          .from('budgets')
          .select('*')
          .eq('profile_id', userId);

        setExpenses(data || []);
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('dashboard')}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Plan Your Expenses</Text>
      </View>

      {/* Expenses List Section */}
      <ScrollView style={styles.expensesContainer}>
            {expenses.map((expense) => (
                <View key={expense.id} style={styles.expenseItem}>
                {/* Expense Info */}
                <View style={styles.expenseDetails}>
                    <Text style={styles.expenseName}>{expense.name}</Text>
                    <Text style={styles.expenseDate}>{expense.end_date}</Text>
                    <Text style={styles.expenseBudget}>Budget: ₱{expense.amount}</Text>
                </View>

                {/* Checkbox and Delete Button */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                    onPress={() => deleteExpense(expense.id)}
                    style={styles.deleteButton}
                    >
                    <Icon name="delete" size={34} color="Black" />
                    </TouchableOpacity>
                </View>
                </View>
            ))}
        </ScrollView>

      {/* Button to show/hide the form */}
      <TouchableOpacity style={styles.toggleButton} onPress={() => setIsFormVisible(!isFormVisible)}>
        <Text style={styles.toggleButtonText}>
          {isFormVisible ? 'Hide Form' : 'Add Expense'}
        </Text>
      </TouchableOpacity>

      {/* Form Section */}
      {isFormVisible && (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Name of your expense"
            value={name}
            onChangeText={setName}
          />
          <TouchableOpacity onPress={() => setShowPicker(true)}>
            <View style={styles.input}>
              <Text>{date.toISOString().split('T')[0]}</Text>
            </View>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowPicker(false);
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Budget"
            value={budget}
            onChangeText={setBudget}
            keyboardType="numeric"
          />
          <Button title="Add Expense" onPress={handleAddExpense} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    height: 60,
    backgroundColor: '#3498db',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: -15,
  },
  headerText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  expensesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  expenseItem: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row', // Keep expense details and actions side by side
    alignItems: 'flex-start', // Align items at the top
    justifyContent: 'space-between',
  },
  actionsContainer: {
    justifyContent: 'center',
    alignItems: 'center', // Center them horizontally
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  expenseDetails: {
    flex: 1,
  },
  expenseName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  expenseDate: {
    fontSize: 14,
    color: '#666',
  },
  expenseBudget: {
    fontSize: 14,
    color: '#666',
  },
  toggleButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#e74c3c',
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default BudgetPlanner;
