import { View, Text, StyleSheet } from "react-native";

export default function ExploreScreen() {
  return (
    <View style={s.container}>
      <Text style={s.title}>Explore</Text>
      <Text style={s.subtitle}>Coming soon</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "600", color: "#1f2937" },
  subtitle: { marginTop: 8, fontSize: 14, color: "#6b7280" },
});
