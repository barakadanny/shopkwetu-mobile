import { useEffect } from "react";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { router } from "expo-router";
import { signInWithGoogle } from "@/lib/auth";

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;

export function useGoogleAuth() {
  const discovery = AuthSession.useAutoDiscovery(
    "https://accounts.google.com"
  );

  const redirectUri = AuthSession.makeRedirectUri({ scheme: "shopkwetu" });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID ?? "",
      scopes: ["openid", "profile", "email"],
      redirectUri,
      responseType: AuthSession.ResponseType.IdToken,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      if (id_token) {
        signInWithGoogle(id_token)
          .then(() => router.replace("/(tabs)"))
          .catch(() => {});
      }
    }
  }, [response]);

  return {
    promptAsync,
    isReady: !!request,
  };
}
