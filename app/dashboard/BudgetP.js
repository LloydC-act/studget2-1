import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Modal } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const initialData = [
  { id: '1', name: 'Keyboard', brand: 'Logitech', model: 'K840', category: 'Input Device', serial: 'KB123', stock: 3, quantity: 1 },
  { id: '2', name: 'Monitor', brand: 'Samsung', model: 'U28E590D', category: 'Display', serial: 'MON456', stock: 8, quantity: 1 },
  { id: '3', name: 'CPU', brand: 'Intel', model: 'i7-9700K', category: 'Processor', serial: 'CPU789', stock: 2, quantity: 1 },
  { id: '4', name: 'Mouse', brand: 'Razer', model: 'DeathAdder Elite', category: 'Input Device', serial: 'MOUSE012', stock: 5, quantity: 1 },
  { id: '5', name: 'RAM', brand: 'Corsair', model: 'Vengeance LPX', category: 'Memory', serial: 'RAM345', stock: 1, quantity: 1 },
  { id: '6', name: 'SSD', brand: 'Samsung', model: '970 EVO Plus', category: 'Storage', serial: 'SSD678', stock: 6, quantity: 1 },
];

const App = () => {
  const [data, setData] = useState(initialData);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    brand: '',
    model: '',
    category: '',
    serial: '',
    stock: '',
    quantity: '',
  });
  const [searchText, setSearchText] = useState('');
  const [filterText, setFilterText] = useState('');

  const handleAddItem = () => {
    setData([...data, { ...newItem, id: Date.now().toString() }]);
    setNewItem({ name: '', brand: '', model: '', category: '', serial: '', stock: '', quantity: '' });
    setModalVisible(false);
  };

  const handleEditItem = () => {
    const updatedData = data.map(item =>
      item.id === currentItem.id ? { ...item, ...newItem } : item
    );
    setData(updatedData);
    setNewItem({ name: '', brand: '', model: '', category: '', serial: '', stock: '', quantity: '' });
    setModalVisible(false);
    setIsEdit(false);
  };

  const handleDelete = (id) => {
    setData(data.filter(item => item.id !== id));
  };

  const handleOpenEditModal = (item) => {
    setCurrentItem(item);
    setNewItem({ ...item });
    setIsEdit(true);
    setModalVisible(true);
  };

  // Search and filter logic
  const filterProducts = () => {
    return data.filter((item) => {
      // Searching by name, model, or category
      const matchesSearch =
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.model.toLowerCase().includes(searchText.toLowerCase()) ||
        item.category.toLowerCase().includes(searchText.toLowerCase());

      // Filtering by stock status (in stock, out of stock)
      const matchesFilter =
        (filterText === 'in stock' ? item.stock > 0 : filterText === 'out of stock' ? item.stock === 0 : true);

      return matchesSearch && matchesFilter;
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>📦 Product Inventory</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchText}
          onChangeText={setSearchText}
        />

        {/* Dropdown for filter options inside the search bar */}
        <RNPickerSelect
          style={pickerSelectStyles}
          onValueChange={(value) => setFilterText(value)}
          items={[
            { label: 'All Products', value: '' },
            { label: 'In Stock', value: 'in stock' },
            { label: 'Out of Stock', value: 'out of stock' },
          ]}
          placeholder={{
            label: 'Filter',
            value: '',
          }}
        />

        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+ Add Product</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filterProducts()}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text>Brand: {item.brand}</Text>
            <Text>Model: {item.model}</Text>
            <Text>Category: {item.category}</Text>
            <Text>Serial: {item.serial}</Text>
            <Text>Stock: {item.stock}</Text>
            <Text>Quantity: {item.quantity}</Text>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.editButton} onPress={() => handleOpenEditModal(item)}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{isEdit ? 'Edit Product' : 'Add New Product'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={newItem.name}
            onChangeText={(text) => setNewItem({ ...newItem, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Brand"
            value={newItem.brand}
            onChangeText={(text) => setNewItem({ ...newItem, brand: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Model"
            value={newItem.model}
            onChangeText={(text) => setNewItem({ ...newItem, model: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Category"
            value={newItem.category}
            onChangeText={(text) => setNewItem({ ...newItem, category: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Serial"
            value={newItem.serial}
            onChangeText={(text) => setNewItem({ ...newItem, serial: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Stock"
            value={newItem.stock}
            onChangeText={(text) => setNewItem({ ...newItem, stock: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Quantity"
            value={newItem.quantity}
            onChangeText={(text) => setNewItem({ ...newItem, quantity: text })}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.saveButton} onPress={isEdit ? handleEditItem : handleAddItem}>
            <Text style={styles.saveButtonText}>{isEdit ? 'Save Changes' : 'Save'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderRadius: 8,
    marginLeft: 10
  },
  inputAndroid: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderRadius: 8,
    marginLeft: 10
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#B09FE4', padding: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  searchContainer: { flexDirection: 'row', marginBottom: 16, alignItems: 'center' },
  searchInput: { flex: 1, borderWidth: 1, borderRadius: 8, padding: 8, marginRight: 8, backgroundColor: '#fff' },
  addButton: { backgroundColor: '#6D28D9', padding: 10, borderRadius: 8 },
  addButtonText: { color: '#fff' },
  itemCard: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 10 },
  itemTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  deleteButton: { backgroundColor: '#EF4444', padding: 8, borderRadius: 8, marginTop: 8 },
  deleteButtonText: { color: '#fff', textAlign: 'center' },
  editButton: { backgroundColor: '#4ADE80', padding: 8, borderRadius: 8, marginTop: 8, marginRight: 8 },
  editButtonText: { color: '#fff', textAlign: 'center' },
  buttonsContainer: { flexDirection: 'row', marginTop: 10 },
  modalContainer: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#F3E8FF' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderRadius: 8, padding: 10, backgroundColor: '#fff', marginBottom: 12 },
  saveButton: { backgroundColor: '#4ADE80', padding: 12, borderRadius: 8, marginBottom: 8 },
  saveButtonText: { textAlign: 'center', color: '#fff', fontWeight: 'bold' },
  cancelButton: { padding: 12 },
  cancelButtonText: { textAlign: 'center', color: '#6B7280' },
});

export default App
