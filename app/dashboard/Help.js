import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, StyleSheet } from 'react-native';

const Help = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.header}>Help & Support</Text>

        <Text style={styles.subHeader}>
          Need help with the Inventory Management System? The IT team is here to support you.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Guidelines</Text>
          <Text>
            Learn how to use the inventory system effectively. Review our usage guidelines.
          </Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://example.com/inventory-guidelines')}>
            <Text style={styles.link}>View Guidelines</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Report a Problem</Text>
          <Text>
            Encountered a bug or issue in the system? Contact the system developer directly.
          </Text>
          <TouchableOpacity onPress={() => Linking.openURL('mailto:devteam@example.com')}>
            <Text style={styles.link}>devteam@example.com</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>IT Support Hotline</Text>
          <Text>
            For urgent system issues, call the IT support team.
          </Text>
          <TouchableOpacity onPress={() => Linking.openURL('tel:+1234567890')}>
            <Text style={styles.link}>+1 234 567 890</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chat with IT Support</Text>
          <Text>
            Chat with a support agent via our official messaging channel.
          </Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://t.me/InventorySupportBot')}>
            <Text style={styles.link}>Open Chat</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stay Updated</Text>
          <Text>
            Follow our internal announcement board for updates and system maintenance schedules.
          </Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://intranet.example.com/updates')}>
            <Text style={styles.link}>Visit Update Board</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

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

export default Help;
