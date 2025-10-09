import { StyleSheet, Text, View } from "react-native";

export default function StocksScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stocks</Text>
      <View style={styles.card}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text>Span 1,774</Text>
          <Text style={styles.amount}>₹1,77,400</Text>
        </View>
        <Text>1,255 Party 71%</Text>
        <Text>519 Yard 29%</Text>
        <Text style={styles.sub}>₹1,25,500 | ₹51,900</Text>
      </View>
    </View>
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
  },
  amount: { fontWeight: "bold", fontSize: 16 },
  sub: { marginTop: 8, color: "gray" },
});
