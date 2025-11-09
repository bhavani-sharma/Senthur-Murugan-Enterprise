import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator, RefreshControl } from "react-native";
import React, { useState, useEffect } from "react";
import { fetchParties, deleteParty } from '../supabaseClient';

export default function PartyScreen({ navigation }) {
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch parties from Supabase
  const loadParties = async () => {
    try {
      const { data, error } = await fetchParties();

      if (error) {
        console.error('Error fetching parties:', error);
        Alert.alert('Error', 'Failed to load parties');
        return;
      }

      setParties(data || []);
    } catch (err) {
      console.error('Unexpected error:', err);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load parties on mount
  useEffect(() => {
    loadParties();
  }, []);

  // Refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    loadParties();
  };

  // Delete party handler
  const handleDeleteParty = (partyId, partyName) => {
    Alert.alert(
      'Delete Party',
      `Are you sure you want to delete "${partyName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await deleteParty(partyId);

              if (error) {
                Alert.alert('Error', 'Failed to delete party');
                return;
              }

              // Refresh the list
              loadParties();
              Alert.alert('Success', 'Party deleted successfully');
            } catch (err) {
              console.error('Delete error:', err);
              Alert.alert('Error', 'An unexpected error occurred');
            }
          }
        }
      ]
    );
  };

  // Get current date
  const getCurrentDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#5E5165" />
        <Text style={styles.loadingText}>Loading parties...</Text>
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
      <Text style={styles.title}>Party</Text>

      <View style={styles.dateContainer}>
        <Text style={styles.date}>{getCurrentDate()}</Text>
      </View>

      {parties.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No parties added yet</Text>
          <Text style={styles.emptySubText}>Tap "Add Party" to get started</Text>
        </View>
      ) : (
        parties.map((party) => (
          <View key={party.id} style={styles.userCard}>
            <TouchableOpacity
              onPress={() => navigation.navigate("User", { partyId: party.id, partyName: party.party_name })}
              style={styles.userNameContainer}
            >
              <Text style={styles.userName}>{party.party_name}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDeleteParty(party.id, party.party_name)}
            >
              <Text style={{ color: "white" }}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate("AddUser")}>
        <Text style={styles.addText}>Add Party</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 10 },
  dateContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  date: { fontSize: 16, fontWeight: "600" },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    elevation: 3,
  },
  userNameContainer: {
    flex: 1,
  },
  userName: { fontWeight: "500", fontSize: 16 },
  deleteBtn: {
    backgroundColor: "#d51d1dff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 10,
  },
  addBtn: {
    backgroundColor: "#5E5165",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 20,
  },
  addText: { color: "#fff", fontWeight: "600" , textAlign: "center" },
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
