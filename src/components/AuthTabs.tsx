import React from "react";

interface AuthTabsProps {
  activeTab: "login" | "register";
  onTabSwitch: (tab: "login" | "register") => void;
}

const AuthTabs: React.FC<AuthTabsProps> = ({ activeTab, onTabSwitch }) => {
  return (
    <div className="auth-tabs">
      <button
        className={`tab-button ${activeTab === "login" ? "active" : ""}`}
        onClick={() => onTabSwitch("login")}
      >
        Login
      </button>
      <button
        className={`tab-button ${activeTab === "register" ? "active" : ""}`}
        onClick={() => onTabSwitch("register")}
      >
        Sign Up
      </button>
    </div>
  );
};

export default AuthTabs;
