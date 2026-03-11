import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import type { AuthResponse, SignInPayload, SignUpPayload } from "@/types/auth";

export async function signUp(payload: SignUpPayload): Promise<void> {
  await api.post("/auth/signup", payload);
}

export async function signInWithCredentials(
  payload: SignInPayload
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(
    "/auth/mobile/login",
    payload
  );
  await useAuthStore.getState().setAuth(data.user, data.token);
  return data;
}

export async function signInWithGoogle(
  idToken: string
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/mobile/google", {
    idToken,
  });
  await useAuthStore.getState().setAuth(data.user, data.token);
  return data;
}

export async function refreshSession(): Promise<void> {
  try {
    const { data } = await api.get<AuthResponse>("/auth/mobile/session");
    await useAuthStore.getState().setAuth(data.user, data.token);
  } catch {
    await useAuthStore.getState().clearAuth();
  }
}

export async function signOut(): Promise<void> {
  await useAuthStore.getState().clearAuth();
}
