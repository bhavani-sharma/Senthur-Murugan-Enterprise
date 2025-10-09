import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import StockScreen from "./StockScreen";
import PartyScreen from "./PartyScreen";
import UserScreen from "./UserScreen";

const Drawer = createDrawerNavigator();
function DashboardHome({ navigation }) {
  return(
  <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Total Revenue</Text>
        <Text style={styles.value}>₹2,51,251.22</Text>
        <Text style={styles.sub}>↑ 20% rise from last month</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Stock Value</Text>
        <Text style={styles.value}>₹12,25,23</Text>
        <Text style={[styles.sub, { color: "red" }]}>↓ 12% from last month</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Active Users</Text>
        <Text style={styles.value}>2,255</Text>
        <Text style={styles.sub}>+180 from last week</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Active Products</Text>
        <Text style={styles.value}>622</Text>
        <Text style={styles.sub}>+10 from last week</Text>
      </View>

      <Text style={styles.section}>Recent Activity</Text>
      <View style={styles.card}>
        <Text>Name 1 - Updated inventory</Text>
        <Text>Name 2 - Added stock item</Text>
        <Text>Name 3 - Added item</Text>
      </View>

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
      <Drawer.Screen name="User" component={UserScreen} />
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
  sub: { color: "green" },
  section: { fontSize: 18, marginVertical: 10, fontWeight: "600" },
  navButton: { backgroundColor: "#5E5165", padding: 12, borderRadius: 8, marginTop: 20 },
  navText: { color: "#fff", textAlign: "center", fontWeight: "600" },
});
