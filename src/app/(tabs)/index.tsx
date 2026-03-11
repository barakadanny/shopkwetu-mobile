import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-3xl font-bold text-primary-600">ShopKwetu</Text>
      <Text className="mt-2 text-base text-gray-500">
        Your marketplace, your way
      </Text>
    </View>
  );
}
