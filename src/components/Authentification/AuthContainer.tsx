import React, { useState } from "react";
import Logo from "@/components/Logo";
import GoogleSignIn from "@/components/Authentification/GoogleSignIn";
import EmailPasswordAuth from "@/components/Authentification/EmailPasswordAuth";
import FitnessLevelSelector from "@/components/Authentification/FitnessLevelSelector";
import Message from "@/components/Message";
import { authAPI } from "@/services/apiService";
import type { User } from "@/types/User";

interface MessageType {
  text: string;
  type: "success" | "error" | "loading" | "info";
}

interface AuthContainerProps {
  onUserLogin: (userData: User, rememberMe?: boolean) => void;
}

type AuthStep = "signin" | "fitness-level";
type SignInMethod = "google" | "email";

const AuthContainer: React.FC<AuthContainerProps> = ({ onUserLogin }) => {
  const [message, setMessage] = useState<MessageType | null>(null);
  const [authStep, setAuthStep] = useState<AuthStep>("signin");
  const [signInMethod, setSignInMethod] = useState<SignInMethod>("email");
  const [tempUserData, setTempUserData] = useState<User | null>(null);

  const handleMessage = (text: string, type: MessageType["type"]) => {
    setMessage({ text, type });
  };

  const handleGoogleSignInSuccess = async (userData: User, rememberMe?: boolean) => {
    try {
      // Check if user already has a fitness level set by fetching their profile
      const { user } = await authAPI.getProfile();
      
      if (user.fitnessLevel) {
        // User already has fitness level, proceed with login
        onUserLogin(userData, rememberMe);
      } else {
        // New user, show fitness level selection
        setTempUserData(userData);
        setAuthStep("fitness-level");
        setMessage(null);
      }
    } catch {
      // If profile fetch fails, assume new user and show fitness level selection
      setTempUserData(userData);
      setAuthStep("fitness-level");
      setMessage(null);
    }
  };

  const handleFitnessLevelComplete = async (fitnessLevel: number) => {
    if (!tempUserData) return;
    
    try {
      setMessage({ text: "Setting up your profile...", type: "loading" });
      
      // Update user profile with fitness level
      await authAPI.updateProfile(undefined, fitnessLevel);
      
      setMessage({ text: "Profile setup complete! Welcome!", type: "success" });
      
      // Complete the login process
      setTimeout(() => {
        onUserLogin(tempUserData, true);
      }, 1000);
    } catch (error) {
      console.error("Error updating fitness level:", error);
      setMessage({ text: "Profile setup failed, but you can set this later in settings", type: "error" });
      
      // Still complete login even if fitness level update fails
      setTimeout(() => {
        onUserLogin(tempUserData, true);
      }, 2000);
    }
  };

  const handleFitnessLevelSkip = () => {
    if (!tempUserData) return;
    
    setMessage({ text: "You can set your fitness level later in profile settings", type: "info" });
    setTimeout(() => {
      onUserLogin(tempUserData, true);
    }, 1500);
  };

  if (authStep === "fitness-level") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex flex-col items-center justify-center p-4">
        <Logo />
        
        {message && (
          <div className="mb-6">
            <Message text={message.text} type={message.type} />
          </div>
        )}

        <FitnessLevelSelector 
          onComplete={handleFitnessLevelComplete}
          onSkip={handleFitnessLevelSkip}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex flex-col items-center justify-center p-4">
      <Logo />

      {message && (
        <div className="mb-6">
          <Message text={message.text} type={message.type} />
        </div>
      )}

      <div className="w-full max-w-md bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
        {/* Authentication Method Toggle */}
        <div className="flex mb-6 bg-slate-700/30 rounded-lg p-1">
          <button
            onClick={() => setSignInMethod("email")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              signInMethod === "email"
                ? "bg-amber-500 text-black"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Email / Password
          </button>
          <button
            onClick={() => setSignInMethod("google")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              signInMethod === "google"
                ? "bg-amber-500 text-black"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Google
          </button>
        </div>

        {/* Authentication Form */}
        {signInMethod === "email" ? (
          <EmailPasswordAuth 
            onMessage={handleMessage} 
            onUserLogin={handleGoogleSignInSuccess} 
          />
        ) : (
          <div className="text-center">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-1">
                Sign in with Google
              </h3>
              <p className="text-slate-400 text-sm">
                Use your Google account to access your workout data
              </p>
            </div>
            <GoogleSignIn onMessage={handleMessage} onUserLogin={handleGoogleSignInSuccess} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthContainer;
