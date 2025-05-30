import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Button } from 'react-native-paper';
import { View, Text, Image, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { DrawerItemList } from '@react-navigation/drawer';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';

const CustomDrawerContent = (props) => {
  const router = useRouter();

  return (
    <View style={{ flex: 1 , backgroundColor: 'B09FE4'}}>
      <View style={styles.drawerContent}>
      <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://storage.googleapis.com/a1aa/image/pECnn_pfL37p2WKmUnoboOqNSFN0t47CsoHuHqvVNLY.jpg' }}
            style={styles.logo}
          />
          <Text style={styles.logoText}>Inventory</Text>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, backgroundColor:'B09FE4' }}
      >
        <DrawerItemList {...props} />
      </ScrollView>
      <View style={styles.logoutButtonContainer}>
        <Button
          mode="contained"
          onPress={() => {
            // Simulate logout action
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
            drawerLabel: 'Dashboard',
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
          name="BudgetP"
          options={{
            drawerLabel: 'Items',
            title: 'All Items',
            drawerIcon: () => (
              <MaterialIcons
                name="shopping-bag"
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
    padding: 20,
    backgroundColor: '#B09FE4',
    marginBottom: 50,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
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