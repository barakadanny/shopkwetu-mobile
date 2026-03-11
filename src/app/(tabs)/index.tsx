import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View style={s.container}>
      <Text style={s.title}>ShopKwetu</Text>
      <Text style={s.subtitle}>Your marketplace, your way</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  title: { fontSize: 30, fontWeight: "bold", color: "#059669" },
  subtitle: { marginTop: 8, fontSize: 16, color: "#6b7280" },
});
