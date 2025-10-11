import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function UserScreen({navigation}) {
  const records = [
    { date: "21/09/2025", items: ["Item 1", "Item 2", "Item 3", "Item 6"] },
    { date: "22/09/2025", items: ["Item 2", "Item 4"] },
    { date: "23/09/2025", items: ["Item 1", "Item 5", "Item 6"] },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Name 1</Text>
      {records.map((rec, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.date}>{rec.date}</Text>
          {rec.items.map((item, j) => (
            <Text key={j}>{item}</Text>
          ))}
        </View>
      ))}
      <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate("AddItem")}>
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
  date: { fontWeight: "600", marginBottom: 5 },
  addBtn: {
    backgroundColor: "#5E5165",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  addText: { color: "#fff", fontWeight: "600" },
});
