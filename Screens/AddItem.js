import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator } from "react-native";
import { TextInput, Button } from 'react-native';
import { SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { fetchProducts, addBulkTransactions } from '../supabaseClient';

export default function AddItem({ navigation, route }) {
  const { partyId, partyName } = route.params || {};
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [transactionType, setTransactionType] = useState('given');
  const [items, setItems] = useState([{ productId: '', quantity: '' }]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Load products
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await fetchProducts();
      if (error) {
        console.error('Error fetching products:', error);
        Alert.alert('Error', 'Failed to load products');
        return;
      }
      setProducts(data || []);
    } catch (err) {
      console.error('Unexpected error:', err);
      Alert.alert('Error', 'Failed to load products');
    } finally {
      setLoadingProducts(false);
    }
  };

  // Add another item row
  const addItemRow = () => {
    setItems([...items, { productId: '', quantity: '' }]);
  };

  // Remove an item row
  const removeItemRow = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  // Update item at index
  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  // Handle form submission
  const handleAddItems = async () => {
    // Validate
    if (!partyId) {
      Alert.alert('Error', 'Party information not found');
      return;
    }

    if (!transactionDate) {
      Alert.alert('Error', 'Transaction date is required');
      return;
    }

    // Validate items
    const validItems = items.filter(item => item.productId && item.quantity);
    if (validItems.length === 0) {
      Alert.alert('Error', 'Please add at least one item with quantity');
      return;
    }

    // Check for invalid quantities
    const hasInvalidQuantity = validItems.some(
      item => isNaN(parseInt(item.quantity)) || parseInt(item.quantity) <= 0
    );

    if (hasInvalidQuantity) {
      Alert.alert('Error', 'Please enter valid quantities (positive numbers)');
      return;
    }

    setLoading(true);

    try {
      // Format items for transaction
      const transactionItems = validItems.map(item => ({
        product_id: item.productId,
        quantity: parseInt(item.quantity),
      }));

      const { data, error } = await addBulkTransactions(
        partyId,
        transactionItems,
        transactionDate,
        transactionType
      );

      if (error) {
        Alert.alert('Error', 'Failed to add transactions');
        console.error('Transaction error:', error);
        setLoading(false);
        return;
      }

      Alert.alert('Success', 'Items added successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]);
    } catch (err) {
      console.error('Unexpected error:', err);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loadingProducts) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#5E5165" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        <Text style={styles.title}>Add Transaction</Text>
        <Text style={styles.subtitle}>Party: {partyName}</Text>

        <Text style={styles.label}>Transaction Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={transactionType}
            onValueChange={(value) => setTransactionType(value)}
            style={styles.picker}
          >
            <Picker.Item label="Given to Party" value="given" />
            <Picker.Item label="Returned from Party" value="returned" />
          </Picker>
        </View>

        <Text style={styles.label}>Transaction Date</Text>
        <TextInput
          placeholder="YYYY-MM-DD"
          style={styles.input}
          value={transactionDate}
          onChangeText={setTransactionDate}
        />

        <Text style={styles.sectionTitle}>Items:</Text>

        {items.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <View style={styles.itemContainer}>
              <Text style={styles.label}>Product {index + 1}</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={item.productId}
                  onValueChange={(value) => updateItem(index, 'productId', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Product" value="" />
                  {products.map((product) => (
                    <Picker.Item
                      key={product.id}
                      label={`${product.item_name} (Available: ${product.yard_stock})`}
                      value={product.id}
                    />
                  ))}
                </Picker>
              </View>

              <Text style={styles.label}>Quantity</Text>
              <TextInput
                placeholder="Quantity"
                style={styles.input}
                value={item.quantity}
                onChangeText={(value) => updateItem(index, 'quantity', value)}
                keyboardType="numeric"
              />
            </View>

            {items.length > 1 && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeItemRow(index)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity style={styles.addMoreButton} onPress={addItemRow}>
          <Text style={styles.addMoreText}>+ Add Another Item</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleAddItems}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {transactionType === 'given' ? 'Give Items to Party' : 'Return Items from Party'}
            </Text>
          )}
        </TouchableOpacity>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  sectionTitle: {
    fontWeight: '600',
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 6,
    marginTop: 6,
  },
  pickerContainer: {
    backgroundColor: '#eee',
    borderRadius: 6,
    marginTop: 6,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  itemRow: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  itemContainer: {
    marginBottom: 10,
  },
  removeButton: {
    backgroundColor: '#d32f2f',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  addMoreButton: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginVertical: 10,
  },
  addMoreText: {
    color: '#5E5165',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#5E5165',
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});
