import { View, Text, StyleSheet } from "react-native";

export default function DashboardScreen() {
  return (
    <View style={s.container}>
      <Text style={s.title}>Dashboard</Text>
      <Text style={s.subtitle}>Seller dashboard coming soon</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "600", color: "#1f2937" },
  subtitle: { marginTop: 8, fontSize: 14, color: "#6b7280" },
});
