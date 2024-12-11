import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import RNPickerSelect from 'react-native-picker-select';

const Transact = ({onSwitch}) => {
    const [selectedValue, setSelectedValue] = useState(null);
    const items = [
        { label: 'Expenses', value: 'Expenses' },
        { label: 'Bills', value: 'Bills' },
        { label: 'Emergency', value: 'Emergency' },
    ];
  return (
    <View style={styles.container}>
     <View style={styles.container2}>
      <View style={styles.iconTextContainer}>
      </View >
      <Text style={styles.bal} >Account Balance</Text>
      <Text style={{marginBottom: 20, fontSize: 34 ,color: '#fff'}} >₱ 1,000,000</Text>
      </View>
      <View style={styles.mid}>
        <Text style={styles.text}>To:</Text>
        <View style={styles.iconTextContainer2}>
        <TouchableOpacity>
        <Feather name="plus-circle" size={40} color="#000" borderRadius={50} marginTop={10} />
        </TouchableOpacity>
      </View >
      </View>
      <View style={styles.bot}>
      <Text style={styles.text}>Amount:</Text>
      <TextInput 
        label="Amount" 
        placeholder='Enter Amount'
        mode="outlined" 
        style={styles.input}
        keyboardType="numeric" 
        />
        <Text style={styles.text}>Purpose:</Text>
        <RNPickerSelect
                onValueChange={(value) => setSelectedValue(value)}
                items={items}
                style={pickerSelectStyles}
                placeholder={{ label: 'Select a purpose...', value: null }} // Placeholder
            />
        <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Send</Text>
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
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button1: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  mid: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
    width: '100%',
    height: '15%',
  },
  text: {
    fontSize: 18,
    color: '#000',
  },
  bal:{
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff'
  },
  iconTextContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15
  },
  bot: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
    width: '100%',
    height: '60%',
  },
  input: {
    padding: 10,
    width: '90%',
    alignSelf: 'center', 
    borderBottomWidth: 0.5,
    marginBottom: 5,
    fontSize: 18
  },
  buttonContainer: {
    justifyContent: 'center', 
    alignItems: 'center',
    width: '100%',
    marginTop: 20
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
  
});
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 4,
        color: 'black', // Text color
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 16,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 4,
        color: 'black', // Text color
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});

export default Transact;