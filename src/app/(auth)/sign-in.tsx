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
      style={s.flex}
    >
      <ScrollView
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.header}>
          <Text style={s.brand}>ShopKwetu</Text>
          <Text style={s.headerSub}>Sign in to your account</Text>
        </View>

        {/* Google Sign-In */}
        <TouchableOpacity
          onPress={handleGoogleSignIn}
          disabled={!isGoogleReady || isLoading}
          style={s.googleBtn}
        >
          <Text style={s.googleText}>Continue with Google</Text>
        </TouchableOpacity>

        <View style={s.divider}>
          <View style={s.dividerLine} />
          <Text style={s.dividerText}>or</Text>
          <View style={s.dividerLine} />
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
            <Text style={s.submitText}>Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Link to Sign Up */}
        <View style={s.footer}>
          <Text style={s.footerText}>Don't have an account? </Text>
          <Link href="/(auth)/sign-up" asChild>
            <TouchableOpacity>
              <Text style={s.footerLink}>Sign Up</Text>
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
  googleBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    borderRadius: 12, borderWidth: 1, borderColor: "#d1d5db",
    paddingHorizontal: 16, paddingVertical: 14, marginBottom: 24,
  },
  googleText: { fontSize: 16, fontWeight: "500", color: "#374151" },
  divider: { flexDirection: "row", alignItems: "center", marginBottom: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#e5e7eb" },
  dividerText: { marginHorizontal: 16, fontSize: 14, color: "#9ca3af" },
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
