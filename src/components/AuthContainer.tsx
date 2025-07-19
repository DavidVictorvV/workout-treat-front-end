import React, { useState } from "react";
import Logo from "./Logo";
import AuthTabs from "./AuthTabs";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import GoogleSignIn from "./GoogleSignIn";
import Message from "./Message";

interface MessageType {
  text: string;
  type: "success" | "error" | "loading" | "info";
}

interface AuthContainerProps {
  onUserLogin: (userData: any) => void; // Replace `any` with your `User` type if available
}

const AuthContainer: React.FC<AuthContainerProps> = ({ onUserLogin }) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [message, setMessage] = useState<MessageType | null>(null);

  const handleTabSwitch = (tabName: "login" | "register") => {
    setActiveTab(tabName);
    clearMessage();
  };

  const handleMessage = (text: string, type: MessageType["type"]) => {
    setMessage({ text, type });
  };

  const clearMessage = () => {
    setMessage(null);
  };

  return (
    <div className="auth-container">
      <Logo />

      <AuthTabs activeTab={activeTab} onTabSwitch={handleTabSwitch} />

      {message && <Message text={message.text} type={message.type} />}

      <div className="auth-forms">
        <LoginForm
          isActive={activeTab === "login"}
          onMessage={handleMessage}
          onUserLogin={onUserLogin}
        />

        <RegisterForm
          isActive={activeTab === "register"}
          onMessage={handleMessage}
          onUserLogin={onUserLogin}
        />
      </div>

      <div className="divider">
        <span>or</span>
      </div>

      <GoogleSignIn onMessage={handleMessage} onUserLogin={onUserLogin} />
    </div>
  );
};

export default AuthContainer;
