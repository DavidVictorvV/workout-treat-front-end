import React from "react";

const AuthTabs = ({ activeTab, onTabSwitch }) => {
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
