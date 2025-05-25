import React, { useState } from 'react';
import { Text, View, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { supabase } from '../../../utils/supabaseclient';

export default function PlusScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [processing, setProcessing] = useState(false);

  if (!permission) return <Text>Requesting camera permission...</Text>;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to access the camera</Text>
        <Button title="Grant permission" onPress={requestPermission} />
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }) => {
  if (scanned || processing) return;
  setScanned(true);
  setProcessing(true);

  try {
    // 1. Find product ID by serial number
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('serial_number', data)
      .single();

    if (productError || !product) {
      throw new Error("Product not found for scanned serial number.");
    }

    // 2. Insert into stock_out using product_id
    const { error: insertError } = await supabase.from('stock_out').insert([
      {
        product_id: product.id,
        quantity: 1,
        scanned_code: data,
      },
    ]);

    if (insertError) throw insertError;

    Alert.alert("Success", `Stock Out for serial: ${data}`);
  } catch (error) {
    console.error(error);
    Alert.alert("Error", error.message || "Failed to record stock out");
  } finally {
    setProcessing(false);
  }
};

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'code128', 'code39', 'code93', 'ean13', 'ean8', 'upc_a', 'upc_e'],
        }}
      />
      {scanned && !processing && (
        <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />
      )}
      {processing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Processing...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    marginBottom: 10,
  },
  loadingOverlay: {
    position: 'absolute',
    top: '45%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
});
