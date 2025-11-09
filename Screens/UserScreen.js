import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { fetchTransactionsByParty, formatDate } from '../supabaseClient';

export default function UserScreen({navigation, route}) {
  const { partyId, partyName } = route.params || {};
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load transactions for this party
  const loadTransactions = async () => {
    if (!partyId) {
      Alert.alert('Error', 'Party information not found');
      navigation.goBack();
      return;
    }

    try {
      const { data, error } = await fetchTransactionsByParty(partyId);

      if (error) {
        console.error('Error fetching transactions:', error);
        Alert.alert('Error', 'Failed to load transaction history');
        return;
      }

      setTransactions(data || []);
    } catch (err) {
      console.error('Unexpected error:', err);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [partyId]);

  const onRefresh = () => {
    setRefreshing(true);
    loadTransactions();
  };

  // Group transactions by date
  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const date = transaction.transaction_date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(transaction);
    return acc;
  }, {});

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#5E5165" />
        <Text style={styles.loadingText}>Loading transactions...</Text>
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
      <Text style={styles.title}>{partyName || 'Party Details'}</Text>

      {Object.keys(groupedTransactions).length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No transactions yet</Text>
          <Text style={styles.emptySubText}>Tap "Add Item" to create a transaction</Text>
        </View>
      ) : (
        Object.keys(groupedTransactions)
          .sort((a, b) => new Date(b) - new Date(a))
          .map((date) => (
            <View key={date} style={styles.card}>
              <Text style={styles.date}>{formatDate(date)}</Text>
              {groupedTransactions[date].map((transaction) => (
                <View key={transaction.id} style={styles.transactionItem}>
                  <Text style={styles.itemText}>
                    {transaction.transaction_type === 'given' ? '→' : '←'}{' '}
                    {transaction.products.item_name} - {transaction.quantity} pcs
                  </Text>
                  <Text style={styles.transactionType}>
                    {transaction.transaction_type === 'given' ? 'Given' : 'Returned'}
                  </Text>
                </View>
              ))}
            </View>
          ))
      )}

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate("AddItem", { partyId, partyName })}
      >
        <Text style={styles.addText}>Add Item</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 10 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    elevation: 3,
  },
  date: { fontWeight: "600", marginBottom: 10, fontSize: 16, color: '#5E5165' },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  transactionType: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  addBtn: {
    backgroundColor: "#5E5165",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  addText: { color: "#fff", fontWeight: "600" },
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
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
  },
});
