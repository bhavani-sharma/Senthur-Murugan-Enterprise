import { StyleSheet, Text, View, ScrollView, ActivityIndicator, RefreshControl, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { fetchProducts, formatCurrency } from '../supabaseClient';

export default function StocksScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch products from Supabase
  const loadProducts = async () => {
    try {
      const { data, error } = await fetchProducts();

      if (error) {
        console.error('Error fetching products:', error);
        Alert.alert('Error', 'Failed to load stock data');
        return;
      }

      setProducts(data || []);
    } catch (err) {
      console.error('Unexpected error:', err);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  // Calculate utilization percentage
  const calculateUtilization = (partyStock, totalQuantity) => {
    if (totalQuantity === 0) return 0;
    return Math.round((partyStock / totalQuantity) * 100);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#5E5165" />
        <Text style={styles.loadingText}>Loading stock data...</Text>
      </View>
    );
  }
  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#5E5165']} />
      }
    >
      <Text style={styles.title}>Stocks</Text>

      {products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No stock data available</Text>
        </View>
      ) : (
        products.map((product) => {
          const totalValue = product.total_quantity * product.rate_per_month;
          const partyValue = product.party_stock * product.rate_per_month;
          const yardValue = product.yard_stock * product.rate_per_month;
          const utilization = calculateUtilization(product.party_stock, product.total_quantity);
          const yardPercentage = 100 - utilization;

          return (
            <View key={product.id} style={styles.card}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                <Text style={styles.productName}>
                  {product.item_name} {product.total_quantity.toLocaleString()}
                </Text>
                <Text style={styles.amount}>{formatCurrency(totalValue)}</Text>
              </View>

              <View style={styles.statsRow}>
                <Text style={styles.statsText}>
                  {product.party_stock.toLocaleString()} Party ({utilization}%)
                </Text>
              </View>

              <View style={styles.statsRow}>
                <Text style={styles.statsText}>
                  {product.yard_stock.toLocaleString()} Yard ({yardPercentage}%)
                </Text>
              </View>

              <Text style={styles.sub}>
                {formatCurrency(partyValue)} | {formatCurrency(yardValue)}
              </Text>

              <Text style={styles.rate}>
                Rate: {formatCurrency(product.rate_per_month)}/month
              </Text>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 15 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    elevation: 3,
    marginBottom: 12,
  },
  productName: {
    fontWeight: "600",
    fontSize: 16,
  },
  amount: { fontWeight: "bold", fontSize: 16, color: "#2e7d32" },
  sub: { marginTop: 8, color: "gray", fontSize: 14 },
  rate: { marginTop: 4, color: "#666", fontSize: 12 },
  statsRow: {
    marginVertical: 2,
  },
  statsText: {
    fontSize: 14,
    color: "#444",
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
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
});
