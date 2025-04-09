import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const index = () => {
  const router = useRouter();

  const items = [
    { name: 'Keyboard', stock: 3 },
    { name: 'Monitor', stock: 8 },
    { name: 'CPU', stock: 2 },
    { name: 'Mouse', stock: 5 },
    { name: 'RAM', stock: 1 },
    { name: 'SSD', stock: 6 },
  ];

  const totalItems = items.length;
  const lowStockItems = items.filter(item => item.stock <= 3);
  const latestAdded = items.slice(-3); // last 3 added items

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}></View>

      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Search" />
        <MaterialIcons name="search" size={20} style={styles.searchIcon} />
      </View>

      <View style={styles.listContainer}>
        <View style={styles.list}>
          <Text style={styles.listTitle}>Item List</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Item Name</Text>
              <Text style={styles.tableHeaderText}>Amount</Text>
            </View>
            {items.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableRowText}>{item.name}</Text>
                <Text style={styles.tableRowText}>{item.stock} pcs</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.list}>
          <Text style={styles.listTitle}>Asset List</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Asset Name</Text>
              <Text style={styles.tableHeaderText}>Amount</Text>
            </View>
            {items.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableRowText}>{item.name}</Text>
                <Text style={styles.tableRowText}>{item.stock} pcs</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Product Summary</Text>

        <View style={styles.summaryContent}>
          <View style={styles.summaryItem}>
            <MaterialCommunityIcons name="box" size={30} color="#3b82f6" />
            <View style={styles.summaryText}>
              <Text style={styles.summaryNumber}>{totalItems}</Text>
              <Text>Total Items</Text>
            </View>
          </View>

          <View style={styles.summaryItem}>
            <MaterialCommunityIcons name="alert" size={30} color="#ef4444" />
            <View style={styles.summaryText}>
              <Text style={styles.summaryNumber}>{lowStockItems.length}</Text>
              <Text>Low Stock</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.summaryTitle, { marginTop: 20 }]}>Latest Added</Text>
        {latestAdded.map((item, index) => (
          <Text key={index} style={{ marginBottom: 4, color: '#1f2937' }}>
            • {item.name} ({item.stock} pcs)
          </Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d8b4fe',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  searchInput: {
    width: '100%',
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  searchIcon: {
    position: 'absolute',
    top: '50%',
    right: 16,
    transform: [{ translateY: -10 }],
  },
  listContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  list: {
    flex: 1,
    marginRight: 8,
  },
  listTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  table: {
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
  },
  tableHeaderText: {
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
  },
  tableRowText: {
    color: '#000',
  },
  summary: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryText: {
    marginLeft: 8,
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default index;
