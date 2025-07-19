import React, { useState } from "react";
import Logo from "./Logo";
import AuthTabs from "./AuthTabs";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import GoogleSignIn from "./GoogleSignIn";
import Message from "./Message";

const AuthContainer = ({ onUserLogin }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [message, setMessage] = useState(null);

  const handleTabSwitch = (tabName) => {
    setActiveTab(tabName);
    setMessage(null);
  };

  const handleMessage = (text, type) => {
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
