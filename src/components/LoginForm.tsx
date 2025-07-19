import React, { useState } from "react";
import { loginUser } from "../services/authService";

interface ApiUserData {
  localId: string;
  displayName?: string;
  email: string;
  // Add more backend fields if needed
}

interface User {
  id: string;
  name: string;
  email: string;
  // Add more frontend user fields if needed
}

interface LoginFormProps {
  isActive: boolean;
  onMessage: (text: string, type: "success" | "error" | "loading") => void;
  onUserLogin: (userData: User) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  isActive,
  onMessage,
  onUserLogin,
}) => {
  const [formData, setFormData] = useState<{ email: string; password: string }>(
    {
      email: "",
      password: "",
    }
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    onMessage("Logging in...", "loading");

    try {
      // Get backend user data
      const apiUserData: ApiUserData = await loginUser(
        formData.email,
        formData.password
      );

      // Map backend data to frontend User type
      const userData: User = {
        id: apiUserData.localId,
        name: apiUserData.displayName || "",
        email: apiUserData.email,
      };

      onMessage("Login successful!", "success");
      onUserLogin(userData);
    } catch (error: any) {
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
