import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import React from 'react';

export default function Security() {
  const showAdminOnlyAlert = (actionName) => {
    Alert.alert('Restricted Access', `Only Admin can ${actionName}.`);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Security</Text>
      <Text style={styles.subHeader}>Manage your account's security</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Password</Text>
        <TouchableOpacity onPress={() => showAdminOnlyAlert('change passwords')}>
          <Text style={styles.link}>Change Password</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Authentication</Text>
        <TouchableOpacity onPress={() => showAdminOnlyAlert('manage two-factor authentication')}>
          <Text style={styles.link}>Two-Factor Authentication</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <TouchableOpacity onPress={() => showAdminOnlyAlert('view login history')}>
          <Text style={styles.link}>View Login History</Text>
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
