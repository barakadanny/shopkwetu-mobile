import { View, Text, TouchableOpacity } from "react-native";
import { useAuthStore } from "@/stores/auth-store";
import { signOut } from "@/lib/auth";

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);

  return (
    <View className="flex-1 bg-white px-6 pt-16">
      <Text className="text-2xl font-bold text-gray-800">Profile</Text>

      <View className="mt-6 rounded-xl bg-gray-50 p-4">
        <Text className="text-base font-medium text-gray-800">
          {user?.name ?? "User"}
        </Text>
        <Text className="mt-1 text-sm text-gray-500">{user?.email}</Text>
        <Text className="mt-1 text-xs text-primary-600 font-medium">
          {user?.role}
        </Text>
      </View>

      <TouchableOpacity
        onPress={signOut}
        className="mt-6 items-center rounded-xl border border-red-200 bg-red-50 py-3.5"
      >
        <Text className="text-base font-semibold text-red-600">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
