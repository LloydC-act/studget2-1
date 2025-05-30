import React, { useState } from 'react';
import { Text, View, Button, StyleSheet, Alert, ActivityIndicator, TextInput } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { supabase } from '../../../utils/supabaseclient';

export default function PlusScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [awaitingQuantity, setAwaitingQuantity] = useState(false);

  if (!permission) return <Text>Requesting camera permission...</Text>;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to access the camera</Text>
        <Button title="Grant permission" onPress={requestPermission} />
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }) => {
    if (scanned || processing) return;
    setScanned(true);
    setScannedData(data);
    setAwaitingQuantity(true);
  };

  const handleConfirmStockOut = async () => {
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      Alert.alert("Invalid Quantity", "Please enter a quantity greater than 0.");
      return;
    }

    setProcessing(true);
    setAwaitingQuantity(false);

    try {
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('id')
        .eq('serial_number', scannedData)
        .single();

      if (productError || !product) {
        throw new Error("Product not found for scanned serial number.");
      }

      const { error: insertError } = await supabase.from('stock_out').insert([
        {
          product_id: product.id,
          quantity: qty,
          scanned_code: scannedData,
        },
      ]);

      if (insertError) throw insertError;

      Alert.alert("Success", `Stocked out ${qty} item(s) for serial: ${scannedData}`);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message || "Failed to record stock out");
    } finally {
      setProcessing(false);
      setScanned(false);
      setScannedData(null);
      setQuantity('');
    }
  };

  const handleCancel = () => {
    setScanned(false);
    setScannedData(null);
    setQuantity('');
    setAwaitingQuantity(false);
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
      {awaitingQuantity && !processing && (
        <View style={styles.inputContainer}>
          <Text style={styles.message}>Scanned Serial: {scannedData}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter quantity"
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />
          <Button title="Confirm Stock Out" onPress={handleConfirmStockOut} />
          <Button title="Cancel" color="red" onPress={handleCancel} />
        </View>
      )}
      {scanned && !processing && !awaitingQuantity && (
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
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 5,
    borderRadius: 5,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#fff',
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
