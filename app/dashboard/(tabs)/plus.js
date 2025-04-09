import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Modal } from 'react-native';

const initialData = [
  { id: '1', name: 'Keyboard', stock: 3 },
  { id: '2', name: 'Monitor', stock: 8 },
  { id: '3', name: 'CPU', stock: 2 },
  { id: '4', name: 'Mouse', stock: 5 },
  { id: '5', name: 'RAM', stock: 1 },
  { id: '6', name: 'SSD', stock: 6 },
];

const StockManagement = () => {
  const [data, setData] = useState(initialData);
  const [modalVisible, setModalVisible] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', stock: '' });

  const handleStockIn = (item) => {
    const updatedData = data.map(i =>
      i.id === item.id ? { ...i, stock: i.stock + 1 } : i
    );
    setData(updatedData);
  };

  const handleStockOut = (item) => {
    if (item.stock > 0) {
      const updatedData = data.map(i =>
        i.id === item.id ? { ...i, stock: i.stock - 1 } : i
      );
      setData(updatedData);
    } else {
      alert('No stock left to remove!');
    }
  };

  const handleAddItem = () => {
    setData([...data, { ...newItem, id: Date.now().toString() }]);
    setNewItem({ name: '', stock: '' });
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>📦 Stock Management</Text>

      <Text style={styles.sectionTitle}>Stock Transactions</Text>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text>Current Stock: {item.stock}</Text>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.stockInButton} onPress={() => handleStockIn(item)}>
                <Text style={styles.stockInButtonText}>Stock In</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stockOutButton} onPress={() => handleStockOut(item)}>
                <Text style={styles.stockOutButtonText}>Stock Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add New Item</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={newItem.name}
            onChangeText={(text) => setNewItem({ ...newItem, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Stock"
            value={newItem.stock}
            onChangeText={(text) => setNewItem({ ...newItem, stock: text })}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleAddItem}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Add New Item</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EDE9FE', padding: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 12 },
  itemCard: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 10 },
  itemTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  buttonsContainer: { flexDirection: 'row', marginTop: 10 },
  stockInButton: { backgroundColor: '#34D399', padding: 8, borderRadius: 8, marginRight: 8 },
  stockInButtonText: { color: '#fff', textAlign: 'center' },
  stockOutButton: { backgroundColor: '#FBBF24', padding: 8, borderRadius: 8 },
  stockOutButtonText: { color: '#fff', textAlign: 'center' },
  modalContainer: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#F3E8FF' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderRadius: 8, padding: 10, backgroundColor: '#fff', marginBottom: 12 },
  saveButton: { backgroundColor: '#4ADE80', padding: 12, borderRadius: 8, marginBottom: 8 },
  saveButtonText: { textAlign: 'center', color: '#fff', fontWeight: 'bold' },
  cancelButton: { padding: 12 },
  cancelButtonText: { textAlign: 'center', color: '#6B7280' },
  addButton: { backgroundColor: '#6D28D9', padding: 10, borderRadius: 8, marginTop: 16 },
  addButtonText: { color: '#fff', textAlign: 'center' },
});

export default StockManagement;
