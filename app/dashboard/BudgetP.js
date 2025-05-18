import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { supabase } from '../../utils/supabaseclient';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('receive_on', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error.message);
    } else {
      setProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemInfo}>
        <View style={{ flex: 1 }}>
          <Text style={styles.itemTitle}>{item.name}</Text>
          <Text>Brand: {item.brand}</Text>
          <Text>Model: {item.model}</Text>
          <Text>Category: {item.category}</Text>
          <Text>Serial Number: {item.serial_number}</Text>
          <Text>Quantity: {item.quantity}</Text>
          <Text>Price: ₱{item.price?.toFixed(2) ?? '0.00'}</Text>
        </View>
        {item.product_image_url && (
          <Image
            source={{ uri: item.product_image_url }}
            style={styles.productImage}
            resizeMode="cover"
          />
        )}
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#6D28D9" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>📦 Product Inventory</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#B09FE4', padding: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  itemCard: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 10 },
  itemInfo: { flexDirection: 'row', alignItems: 'center' },
  itemTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  productImage: { width: 80, height: 80, borderRadius: 8, marginLeft: 12 },
});

export default ProductList;
