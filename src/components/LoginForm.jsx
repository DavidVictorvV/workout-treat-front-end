import React, { useState } from "react";
import { loginUser } from "../services/authService";

const LoginForm = ({ isActive, onMessage, onUserLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    onMessage("Logging in...", "loading");

    try {
      const userData = await loginUser(formData.email, formData.password);
      onMessage("Login successful!", "success");
      onUserLogin(userData);
    } catch (error) {
      onMessage(`Error: ${error.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
    });
  };

  // Reset form when switching tabs
  React.useEffect(() => {
    if (!isActive) {
      resetForm();
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <form className="auth-form active" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="loginEmail">Email</label>
        <input
          type="email"
          id="loginEmail"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          disabled={isLoading}
        />
      </div>
      <div className="form-group">
        <label htmlFor="loginPassword">Password</label>
        <input
          type="password"
          id="loginPassword"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
          disabled={isLoading}
        />
      </div>
      <button type="submit" className="submit-btn" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
