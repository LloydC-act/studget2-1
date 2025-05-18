import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useRouter } from 'expo-router'; // Import useRouter
import { SafeAreaView } from 'react-native-safe-area-context';

const Login = () => {
  const router = useRouter(); // Initialize the router

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loginBox}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://placehold.co/50x50' }}
            style={styles.logo}
          />
          <Text style={styles.logoText}>Inventory</Text>
        </View>
        <Text style={styles.welcomeText}>Welcome👋</Text>
        <Text style={styles.subText}>Please login here</Text>
        <TextInput 
          label="User Id" 
          mode="outlined" 
          style={styles.input} 
        />
        <TextInput 
          label="Password" 
          mode="outlined" 
          secureTextEntry 
          style={styles.input} 
          right={<TextInput.Icon name="eye" />}
        />
        <Button 
          mode="contained" 
          style={styles.button} 
          onPress={() => router.push('dashboard')}
        >
          Login
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B09FE4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginBox: {
    backgroundColor: '#B09FE4',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 180
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    marginRight: 145
  },
  subText: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 20,
    marginRight: 155
  },
  input: {
    marginBottom: 16,
    width: '90%',
    alignSelf: 'center', 
  },
  button: {
    marginBottom: 16,
    width: 180, 
    alignSelf: 'center',
    backgroundColor: '#3655D2' 
  },
});

export default Login;