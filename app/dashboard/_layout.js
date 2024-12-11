import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Button } from 'react-native-paper';
import { View, Text, Image, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { DrawerItemList } from '@react-navigation/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import supabase from '../../utils/client'; // Adjust the import path as needed

const CustomDrawerContent = (props) => {
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // Track refreshing state

  const fetchProfileData = async () => {
    try {
      setLoading(true); // Start loading when refreshing
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser(); // Use getUser() instead of user()
  
      if (authError) {
        console.error('Error getting authenticated user:', authError);
        return;
      }
  
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, student_id, avatar_url')
          .eq('id', user.id) // Use the authenticated user's ID
          .single();
  
        if (error) {
          console.error('Error fetching profile data:', error);
          return;
        }
  
        setProfileData(data);
      } else {
        console.error('No authenticated user found');
      }
    } catch (error) {
      console.error('Unexpected error fetching profile data:', error);
    } finally {
      setLoading(false); // Stop loading spinner
      setRefreshing(false); // Stop refreshing spinner
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfileData(); // Trigger the profile data refresh
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.drawerContent}>
        {loading ? (
          <Text style={styles.headerText}>Loading...</Text>
        ) : (
          <>
            {profileData?.avatar_url ? (
              <Image
                source={{ uri: profileData.avatar_url }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>No Image</Text>
              </View>
            )}
            <Text style={styles.headerText}>
              {profileData?.username || 'User Name'}
            </Text>
            <Text style={styles.headerText}>
              {profileData?.student_id || 'Student ID'}
            </Text>
          </>
        )}
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh} // Trigger refresh when user pulls down
          />
        }
      >
        <DrawerItemList {...props} />
      </ScrollView>
      <View style={styles.logoutButtonContainer}>
        <Button
          mode="contained"
          onPress={async () => {
            await supabase.auth.signOut(); // Log the user out
            router.replace('Login'); // Redirect to Login page
          }}
        >
          Logout
        </Button>
      </View>
    </View>
  );
};

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: 'Home',
            title: 'Dashboard',
            drawerIcon: () => (
              <MaterialCommunityIcons
                name="home-outline"
                size={20}
                color="#000"
              />
            ),
          }}
        />
        <Drawer.Screen
          name="EditProfile"
          options={{
            drawerLabel: 'Edit Profile',
            title: 'Edit Profile',
            drawerIcon: () => (
              <MaterialCommunityIcons
                name="account-cog"
                size={20}
                color="#000"
              />
            ),
          }}
        />
        <Drawer.Screen
          name="Help"
          options={{
            drawerLabel: 'Help',
            title: 'Help',
            drawerIcon: () => (
              <MaterialCommunityIcons
                name="help-circle-outline"
                size={20}
                color="#000"
              />
            ),
          }}
        />
        <Drawer.Screen
          name="Security"
          options={{
            drawerLabel: 'Security',
            title: 'Security',
            drawerIcon: () => (
              <MaterialCommunityIcons
                name="shield-check-outline"
                size={20}
                color="#000"
              />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#D9D9FF',
    marginBottom: 50,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ccc', // Gray background for the "No Image" circle
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff', // White text color for better contrast
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
