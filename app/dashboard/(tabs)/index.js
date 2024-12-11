import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions  } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { useRouter } from 'expo-router';
import { BarChart, Grid } from "react-native-chart-kit";
import { MaterialIcons } from '@expo/vector-icons';

const index = () => {
  const router = useRouter(); 
  const [currentMonth, setCurrentMonth] = useState(0); // 0 = January, 1 = February, etc.
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
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
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726'
    },
    barColors: ['#0000ff', '#BA75D2', '#BA75D2', '#BA75D2'],
    style: {
      borderRadius: 16,
    },
  };

  return (
    <View style={styles.container}>
     <View style={styles.container2}>
      <View style={styles.iconTextContainer}>
        <Text style={styles.text}>Welcome Back!</Text>
        <TouchableOpacity>
          <Icon name="bell" size={30} color="#fff" borderRadius={50} />
        </TouchableOpacity>
      </View >
      <Text style={styles.bal} >Account Balance</Text>
      <View style={styles.transact}>
      <Text style={{fontSize: 34 ,color: '#fff'}}>
        ₱ 1,000,000 
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', 
    alignItems: 'center',
    marginTop: -30,
  },
  container2: {
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#68409C',
    borderRadius: 25,
    width: '100%',
    height: '40%',
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
    marginBottom: 40,
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
    marginTop: 20
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
    color: '#fff'
  },
  num:{
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff'
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
    marginTop: 20
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
});

export default index;