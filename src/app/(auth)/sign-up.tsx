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
  StyleSheet,
} from "react-native";
import { Link, router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpFormData } from "@/lib/validations";
import { signUp } from "@/lib/auth";

export default function SignUpScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    try {
      await signUp(data);
      Alert.alert("Success", "Account created! Please sign in.", [
        { text: "OK", onPress: () => router.replace("/(auth)/sign-in") },
      ]);
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "Sign up failed. Please try again.";
      Alert.alert("Error", message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={s.flex}
    >
      <ScrollView
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.header}>
          <Text style={s.brand}>ShopKwetu</Text>
          <Text style={s.headerSub}>Create your account</Text>
        </View>

        {/* Name */}
        <View style={s.fieldGroup}>
          <Text style={s.label}>Name</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={s.input}
                placeholder="Your full name"
                placeholderTextColor="#9ca3af"
                autoCapitalize="words"
                autoComplete="name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                editable={!isLoading}
              />
            )}
          />
          {errors.name && <Text style={s.error}>{errors.name.message}</Text>}
        </View>

        {/* Email */}
        <View style={s.fieldGroup}>
          <Text style={s.label}>Email</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={s.input}
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
          {errors.email && <Text style={s.error}>{errors.email.message}</Text>}
        </View>

        {/* Password */}
        <View style={s.fieldGroupLg}>
          <Text style={s.label}>Password</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={s.input}
                placeholder="At least 6 characters"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                autoComplete="new-password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                editable={!isLoading}
              />
            )}
          />
          {errors.password && <Text style={s.error}>{errors.password.message}</Text>}
        </View>

        {/* Submit */}
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          style={s.submitBtn}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={s.submitText}>Create Account</Text>
          )}
        </TouchableOpacity>

        {/* Link to Sign In */}
        <View style={s.footer}>
          <Text style={s.footerText}>Already have an account? </Text>
          <Link href="/(auth)/sign-in" asChild>
            <TouchableOpacity>
              <Text style={s.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 24 },
  header: { marginBottom: 40 },
  brand: { fontSize: 30, fontWeight: "bold", textAlign: "center", color: "#059669" },
  headerSub: { marginTop: 8, textAlign: "center", color: "#6b7280" },
  fieldGroup: { marginBottom: 16 },
  fieldGroupLg: { marginBottom: 24 },
  label: { marginBottom: 6, fontSize: 14, fontWeight: "500", color: "#374151" },
  input: {
    borderRadius: 12, borderWidth: 1, borderColor: "#d1d5db",
    paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: "#111827",
  },
  error: { marginTop: 4, fontSize: 14, color: "#ef4444" },
  submitBtn: {
    alignItems: "center", borderRadius: 12,
    backgroundColor: "#059669", paddingVertical: 14, marginBottom: 16,
  },
  submitText: { fontSize: 16, fontWeight: "600", color: "#fff" },
  footer: { flexDirection: "row", justifyContent: "center" },
  footerText: { fontSize: 14, color: "#6b7280" },
  footerLink: { fontSize: 14, fontWeight: "600", color: "#059669" },
});
