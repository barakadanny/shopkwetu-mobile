import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuthStore } from "@/stores/auth-store";
import { signOut } from "@/lib/auth";

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);

  return (
    <View style={s.container}>
      <Text style={s.heading}>Profile</Text>

      <View style={s.card}>
        <Text style={s.name}>{user?.name ?? "User"}</Text>
        <Text style={s.email}>{user?.email}</Text>
        <Text style={s.role}>{user?.role}</Text>
      </View>

      <TouchableOpacity style={s.signOutBtn} onPress={signOut}>
        <Text style={s.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 24, paddingTop: 64 },
  heading: { fontSize: 24, fontWeight: "bold", color: "#1f2937" },
  card: { marginTop: 24, backgroundColor: "#f9fafb", borderRadius: 12, padding: 16 },
  name: { fontSize: 16, fontWeight: "500", color: "#1f2937" },
  email: { marginTop: 4, fontSize: 14, color: "#6b7280" },
  role: { marginTop: 4, fontSize: 12, fontWeight: "500", color: "#059669" },
  signOutBtn: {
    marginTop: 24, alignItems: "center", borderRadius: 12,
    borderWidth: 1, borderColor: "#fecaca", backgroundColor: "#fef2f2", paddingVertical: 14,
  },
  signOutText: { fontSize: 16, fontWeight: "600", color: "#dc2626" },
});
