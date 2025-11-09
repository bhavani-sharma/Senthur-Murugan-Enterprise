import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, RefreshControl, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import StockScreen from "./StockScreen";
import PartyScreen from "./PartyScreen";
import { fetchDashboardMetrics, fetchRecentActivity, formatCurrency } from '../supabaseClient';
// import UserScreen from "./UserScreen";

const Drawer = createDrawerNavigator();

function DashboardHome({ navigation }) {
  const [metrics, setMetrics] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      // Fetch metrics and recent activity in parallel
      const [metricsResult, activityResult] = await Promise.all([
        fetchDashboardMetrics(),
        fetchRecentActivity(5)
      ]);

      if (metricsResult.error) {
        console.error('Error fetching metrics:', metricsResult.error);
      } else {
        setMetrics(metricsResult.data);
      }

      if (activityResult.error) {
        console.error('Error fetching activity:', activityResult.error);
      } else {
        setRecentActivity(activityResult.data || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#5E5165" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }
  return(
  <ScrollView
    style={styles.container}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#5E5165']} />
    }
  >
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Total Revenue</Text>
        <Text style={styles.value}>
          {metrics ? formatCurrency(metrics.total_revenue) : '₹0.00'}
        </Text>
        <Text style={styles.sub}>Monthly revenue from rented equipment</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Stock Value</Text>
        <Text style={styles.value}>
          {metrics ? formatCurrency(metrics.stock_value) : '₹0.00'}
        </Text>
        <Text style={styles.sub}>Total value of all inventory</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Active Parties</Text>
        <Text style={styles.value}>
          {metrics ? metrics.active_parties : 0}
        </Text>
        <Text style={styles.sub}>Current customers with active rentals</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Active Products</Text>
        <Text style={styles.value}>
          {metrics ? metrics.active_products : 0}
        </Text>
        <Text style={styles.sub}>Products in stock</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Stock Utilization</Text>
        <Text style={styles.value}>
          {metrics ? `${metrics.utilization_percentage.toFixed(1)}%` : '0%'}
        </Text>
        <Text style={styles.sub}>
          Party: {metrics ? metrics.total_party_stock.toLocaleString() : 0} |
          Yard: {metrics ? metrics.total_yard_stock.toLocaleString() : 0}
        </Text>
      </View>

      <Text style={styles.section}>Recent Activity</Text>
      {recentActivity.length > 0 ? (
        <View style={styles.card}>
          {recentActivity.map((activity, index) => (
            <View key={activity.id || index} style={styles.activityItem}>
              <Text style={styles.activityText}>
                {activity.party_name} - {activity.transaction_type === 'given' ? 'Took' : 'Returned'} {activity.quantity} {activity.item_name}
              </Text>
              <Text style={styles.activityDate}>
                {new Date(activity.transaction_date).toLocaleDateString()}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.emptyActivity}>No recent activity</Text>
        </View>
      )}

      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Stocks")}>
        <Text style={styles.navText}>Go to Stocks</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
export default function DashboardScreen({ navigation }) {
  return (
    <Drawer.Navigator initialRouteName="DashboardHome">
      <Drawer.Screen name="DashboardHome" component={DashboardHome} options={{ title: "Dashboard" }} />
      <Drawer.Screen name="Stocks" component={StockScreen} />
      <Drawer.Screen name="Party" component={PartyScreen} />
      {/* <Drawer.Screen name="User" component={UserScreen} /> */}
    </Drawer.Navigator>
    
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  label: { fontWeight: "600", fontSize: 16 },
  value: { fontSize: 18, fontWeight: "bold", color: "green", marginVertical: 4 },
  sub: { color: "#666", fontSize: 13 },
  section: { fontSize: 18, marginVertical: 10, fontWeight: "600" },
  navButton: { backgroundColor: "#5E5165", padding: 12, borderRadius: 8, marginTop: 20, marginBottom: 20 },
  navText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  activityItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  activityText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyActivity: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
  },
});
