import React, { useState } from "react";
import { registerUser } from "../services/authService";

const RegisterForm = ({ isActive, onMessage, onUserLogin }) => {
  const [formData, setFormData] = useState({
    displayName: "",
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
    onMessage("Creating account...", "loading");

    try {
      const userData = await registerUser(
        formData.email,
        formData.password,
        formData.displayName
      );
      onMessage("Account created successfully!", "success");
      onUserLogin(userData);
    } catch (error) {
      onMessage(`Error: ${error.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      displayName: "",
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
        <label htmlFor="registerName">Display Name (Optional)</label>
        <input
          type="text"
          id="registerName"
          name="displayName"
          value={formData.displayName}
          onChange={handleInputChange}
          disabled={isLoading}
        />
      </div>
      <div className="form-group">
        <label htmlFor="registerEmail">Email</label>
        <input
          type="email"
          id="registerEmail"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          disabled={isLoading}
        />
      </div>
      <div className="form-group">
        <label htmlFor="registerPassword">Password</label>
        <input
          type="password"
          id="registerPassword"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
          minLength="6"
          disabled={isLoading}
        />
      </div>
      <button type="submit" className="submit-btn" disabled={isLoading}>
        {isLoading ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
};

export default RegisterForm;
