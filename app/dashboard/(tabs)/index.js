import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { useRouter } from 'expo-router';

const index = () => {
  const router = useRouter(); 

  return (
    <View style={styles.container}>
     <View style={styles.container2}>
      <View style={styles.iconTextContainer}>
        <TouchableOpacity>
        <View style={styles.avatarContainer}>
        <Image 
          source={require('../../../assets/avatar.png')}
          style={styles.avatar} /> 
      </View>
        </TouchableOpacity>
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
      <TouchableOpacity style={styles.button} onPress={() => router.push('/app/tansactions')}>
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

      </View>
      <View style={styles.mid}>
        <Text style={styles.buttonText}>Transactions</Text>
      <TouchableOpacity onPress={() => router.push('Transactions')}>
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
  avatarContainer: {
    width: 25 + 25,
    height: 25 + 25, 
    borderRadius: 50, 
    backgroundColor: '#fff',
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  avatar: {
    width: 35, 
    height: 35, 
    borderRadius: 50, 
  },
  text: {
    marginRight: 110, 
    marginLeft: 10,
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
    alignItems: 'center'
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
});

export default index;