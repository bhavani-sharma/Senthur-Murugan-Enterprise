import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PartyScreen({ navigation }) {
  const users = ["Name 1", "Name 2", "Name 3", "Name 4", "Name 5", "Name 6"];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Party</Text>

      <View style={styles.dateContainer}>
        <Text style={styles.date}>21/09/2025</Text>
      </View>

      {users.map((name, index) => (
        <View key={index} style={styles.userCard}>
          <Text style={styles.userName}>{name}</Text>
          <TouchableOpacity style={styles.deleteBtn}>
            <Text style={{ color: "white" }}>🗑️</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate("User")}>
        <Text style={styles.addText}>Add Person</Text>
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
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    elevation: 3,
  },
  userName: { fontWeight: "500", fontSize: 16 },
  deleteBtn: {
    backgroundColor: "#E57373",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addBtn: {
    backgroundColor: "#5E5165",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  addText: { color: "#fff", fontWeight: "600" },
});
