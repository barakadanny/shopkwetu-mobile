import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Link, router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, type SignInFormData } from "@/lib/validations";
import { signInWithCredentials } from "@/lib/auth";
import { useGoogleAuth } from "@/hooks/use-google-auth";

export default function SignInScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { promptAsync, isReady: isGoogleReady } = useGoogleAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    try {
      await signInWithCredentials(data);
      router.replace("/(tabs)");
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "Sign in failed. Please check your credentials.";
      Alert.alert("Error", message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isGoogleReady) return;
    try {
      await promptAsync();
    } catch {
      Alert.alert("Error", "Google sign in failed. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerClassName="flex-1 justify-center px-6"
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-10">
          <Text className="text-3xl font-bold text-center text-primary-600">
            ShopKwetu
          </Text>
          <Text className="mt-2 text-center text-gray-500">
            Sign in to your account
          </Text>
        </View>

        {/* Google Sign-In */}
        <TouchableOpacity
          onPress={handleGoogleSignIn}
          disabled={!isGoogleReady || isLoading}
          className="flex-row items-center justify-center rounded-xl border border-gray-300 px-4 py-3.5 mb-6"
        >
          <Text className="text-base font-medium text-gray-700">
            Continue with Google
          </Text>
        </TouchableOpacity>

        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-px bg-gray-200" />
          <Text className="mx-4 text-sm text-gray-400">or</Text>
          <View className="flex-1 h-px bg-gray-200" />
        </View>

        {/* Email Field */}
        <View className="mb-4">
          <Text className="mb-1.5 text-sm font-medium text-gray-700">
            Email
          </Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900"
                placeholder="you@example.com"
                placeholderTextColor="#9ca3af"
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                editable={!isLoading}
              />
            )}
          />
          {errors.email && (
            <Text className="mt-1 text-sm text-red-500">
              {errors.email.message}
            </Text>
          )}
        </View>

        {/* Password Field */}
        <View className="mb-6">
          <Text className="mb-1.5 text-sm font-medium text-gray-700">
            Password
          </Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900"
                placeholder="Your password"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                autoComplete="password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                editable={!isLoading}
              />
            )}
          />
          {errors.password && (
            <Text className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </Text>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          className="items-center rounded-xl bg-primary-600 py-3.5 mb-4"
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-base font-semibold text-white">Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Link to Sign Up */}
        <View className="flex-row justify-center">
          <Text className="text-sm text-gray-500">
            Don't have an account?{" "}
          </Text>
          <Link href="/(auth)/sign-up" asChild>
            <TouchableOpacity>
              <Text className="text-sm font-semibold text-primary-600">
                Sign Up
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
