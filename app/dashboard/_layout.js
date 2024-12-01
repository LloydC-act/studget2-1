import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Button } from 'react-native-paper';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { DrawerItemList } from '@react-navigation/drawer'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import supabase from '../../utils/client'; // Adjust the import path as needed

const CustomDrawerContent = (props) => {
  const router = useRouter(); 
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = supabase.auth.user(); // Get the currently authenticated user
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('name, id_number') // Adjust the fields you want to fetch
          .eq('email',user.email) // Assuming you have a foreign key relation
          .single(); // Get a single row

        if (error) {
          console.error('Error fetching user data:', error);
        } else {
          setUserData(data);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.drawerContent}>
        <Image
          source={require('../../assets/avatar.png')} 
          style={styles.avatar}
        />
        {loading ? (
          <Text style={styles.headerText}>Loading...</Text>
        ) : (
          <>
            <Text style={styles.headerText}>{userData?.name || 'User  Name'}</Text>
            <Text style={styles.headerText}>{userData?.id_number || 'User  Number'}</Text>
          </>
        )}
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <DrawerItemList {...props} />
      </ScrollView>
      <View style={styles.logoutButtonContainer}>
        <Button mode="contained" onPress={() => router.replace('Login')}>Logout</Button>
      </View>
    </View>
  );
};

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="(tabs)" 
          options={{
            drawerLabel: 'Home',
            title: 'Dashboard',
            drawerIcon: () => <MaterialCommunityIcons name="home-outline" size={20} color="#000" />
          }}
        />
        <Drawer.Screen
          name="EditProfile" 
          options={{
            drawerLabel: 'Edit Profile',
            title: 'Edit Profile',
            drawerIcon: () => <MaterialCommunityIcons name="account-cog" size={20} color="#000" />
          }}
        />
        <Drawer.Screen
          name="Help" 
          options={{
            drawerLabel: 'Help',
            title: 'Help',
            drawerIcon: () => <MaterialCommunityIcons name="help-circle-outline" size={20} color="#000" />
          }}
        />
        <Drawer.Screen
          name="Security" 
          options={{
            drawerLabel: 'Security',
            title: 'Security',
            drawerIcon: () => <MaterialCommunityIcons name="shield-check-outline" size={20} color="#000" />
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#D9D9FF',
    marginBottom: 50
  },
  avatar: {
    width: 80,
    height: 80, 
    borderRadius: 40,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  logoutButtonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc', // Optional: Add a top border to separate the button
  },
});