import React, { useEffect } from "react";
import { useGoogleSignIn } from "../contexts/GoogleSignInContext";
import { googleSignIn } from "../services/authService";
import type { User } from "../types/User";

interface GoogleSignInProps {
  onMessage: (text: string, type: "success" | "error" | "loading") => void;
  onUserLogin: (userData: User) => void;
}

interface GoogleCredentialResponse {
  credential: string;
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({
  onMessage,
  onUserLogin,
}) => {
  const { isGoogleLoaded } = useGoogleSignIn();

  const handleGoogleSignIn = async (response: GoogleCredentialResponse) => {
    onMessage("Signing in with Google...", "loading");

    try {
      const userDataFromApi = await googleSignIn(response.credential);

      // Map API response to User type if needed
      const userData: User = {
        localId: userDataFromApi.localId,
        displayName: userDataFromApi.displayName,
        email: userDataFromApi.email,
        isNewUser: userDataFromApi.isNewUser,
        idToken: userDataFromApi.idToken,
      };

      const message = userData.isNewUser
        ? "Welcome! Account created successfully!"
        : "Welcome back!";
      onMessage(message, "success");
      onUserLogin(userData);
    } catch (error: any) {
      onMessage(`Error: ${error.message}`, "error");
    }
  };

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
  }, [isGoogleLoaded]);

  return (
    <div className="google-signin-container">
      <div id="googleSignInDiv"></div>
    </div>
  );
};

export default GoogleSignIn;
