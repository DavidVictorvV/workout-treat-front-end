import React, { useEffect, useCallback } from "react";
import { useGoogleSignIn } from "@/hooks/useGoogleSignIn";
import { signInWithGoogleCredential } from "@/services/firebaseAuth";
import type { User } from "@/types/User";

interface GoogleSignInProps {
  onMessage: (text: string, type: "success" | "error" | "loading") => void;
  onUserLogin: (userData: User, rememberMe?: boolean) => void;
}

interface GoogleCredentialResponse {
  credential: string;
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({
  onMessage,
  onUserLogin,
}) => {
  const { isGoogleLoaded } = useGoogleSignIn();

  const handleGoogleSignIn = useCallback(async (response: GoogleCredentialResponse) => {
    onMessage("Signing in with Google...", "loading");

    try {
      // Authenticate with Firebase using the Google credential
      const firebaseUser = await signInWithGoogleCredential(response.credential);
      
      if (!firebaseUser) {
        throw new Error("Firebase authentication failed");
      }

      // Create User object from Firebase user data
      const userData: User = {
        localId: firebaseUser.uid,
        displayName: firebaseUser.displayName || "",
        email: firebaseUser.email || "",
        idToken: await firebaseUser.getIdToken(),
      };

      onMessage("Welcome! Signed in with Google successfully!", "success");
      onUserLogin(userData, true); // Always remember Google sign-in
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      onMessage(`Error: ${message}`, "error");
    }
  }, [onMessage, onUserLogin]);

  useEffect(() => {
    if (isGoogleLoaded && window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id:
          import.meta.env.VITE_GOOGLE_CLIENT_ID ||
          "932113529694-vlrs0j2ipbl8aioego28pt3m9h4ab36j.apps.googleusercontent.com",
        callback: handleGoogleSignIn,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        {
          type: "standard",
          theme: "outline",
          size: "large",
        }
      );
    }
  }, [isGoogleLoaded, handleGoogleSignIn]);

  return (
    <div className="google-signin-container">
      <div id="googleSignInDiv"></div>
    </div>
  );
};

export default GoogleSignIn;
