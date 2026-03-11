import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function ModalScreen() {
  return (
    <View className="flex-1 items-center justify-center p-5">
      <Text className="text-2xl font-bold text-gray-800">Modal</Text>
      <Link href="/" dismissTo className="mt-4 py-4">
        <Text className="text-primary-600 font-medium">Go to home screen</Text>
      </Link>
    </View>
  );
}
