import React, { useState } from "react";
import Logo from "@/components/Logo";
import GoogleSignIn from "@/components/Authentification/GoogleSignIn";
import Message from "@/components/Message";
import type { User } from "@/types/User";

interface MessageType {
  text: string;
  type: "success" | "error" | "loading" | "info";
}

interface AuthContainerProps {
  onUserLogin: (userData: User, rememberMe?: boolean) => void;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ onUserLogin }) => {
  const [message, setMessage] = useState<MessageType | null>(null);

  const handleMessage = (text: string, type: MessageType["type"]) => {
    setMessage({ text, type });
  };


  return (
    <div className="auth-container">
      <Logo />

      {message && <Message text={message.text} type={message.type} />}

      <div className="auth-content">
        <h2>Sign in with Google</h2>
        <p>Please use Google authentication to access your workout data.</p>
      </div>

      <GoogleSignIn onMessage={handleMessage} onUserLogin={onUserLogin} />
    </div>
  );
};

export default AuthContainer;
