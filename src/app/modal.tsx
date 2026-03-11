import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function ModalScreen() {
  return (
    <View style={s.container}>
      <Text style={s.title}>Modal</Text>
      <Link href="/" dismissTo style={s.link}>
        <Text style={s.linkText}>Go to home screen</Text>
      </Link>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#1f2937" },
  link: { marginTop: 16, paddingVertical: 16 },
  linkText: { color: "#059669", fontWeight: "500" },
});
