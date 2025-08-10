import { useContext } from "react";
import { GoogleSignInContext } from "@/contexts/GoogleSignInContext";

export const useGoogleSignIn = () => {
  const context = useContext(GoogleSignInContext);
  if (!context) {
    throw new Error(
      "useGoogleSignIn must be used within a GoogleSignInProvider"
    );
  }
  return context;
};