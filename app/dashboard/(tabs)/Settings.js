import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import React from 'react';

export default function Settings() {
  const showAdminOnlyAlert = (actionName) => {
    Alert.alert('Restricted Access', `Only Admin can ${actionName}.`);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <Text style={styles.subHeader}>Configure your inventory app preferences</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>
        <TouchableOpacity onPress={() => showAdminOnlyAlert('edit profile information')}>
          <Text style={styles.link}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <TouchableOpacity onPress={() => showAdminOnlyAlert('manage notification settings')}>
          <Text style={styles.link}>Notification Settings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <TouchableOpacity onPress={() => showAdminOnlyAlert('change app theme')}>
          <Text style={styles.link}>Theme Preferences</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#B09FE4',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 18,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginTop: 5,
  },
});
