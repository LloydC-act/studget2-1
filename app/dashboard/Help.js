import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, StyleSheet } from 'react-native';

const Help = () => {
  return (
  <View style={styles.container}>
    <ScrollView contentContainerStyle={{ padding: 20,}}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
        Help & Support
      </Text>

      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        Need help with our budgeting app? We're here to assist you.
      </Text>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
          Frequently Asked Questions (FAQs)
        </Text>
        <Text>
          Check out our FAQs section for answers to common questions about our app.
        </Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://example.com/faqs')}>
          <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>
            Visit FAQs
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
          Contact Us
        </Text>
        <Text>
          Have a question or issue that's not covered in our FAQs? Reach out to us
          directly.
        </Text>
        <TouchableOpacity onPress={() => Linking.openURL('mailto:support@example.com')}>
          <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>
            support@example.com
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
          Phone Support
        </Text>
        <Text>
          Call us for assistance with our app.
        </Text>
        <TouchableOpacity onPress={() => Linking.openURL('tel:1234567890')}>
          <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>
            123-456-7890
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
          Social Media
        </Text>
        <Text>
          Follow us on social media for updates, tips, and more.
        </Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://twitter.com/example')}>
          <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>
            Twitter
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://facebook.com/example')}>
          <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>
            Facebook
          </Text>
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
    backgroundColor: '#D9D9FF',
  },
});

export default Help;