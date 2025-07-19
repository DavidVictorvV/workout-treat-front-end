import React, {
  useState,
  useEffect,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { registerUser } from "@/services/authService";
import type { User } from "@/types/User";

interface RegisterFormProps {
  isActive: boolean;
  onMessage: (text: string, type: "success" | "error" | "loading") => void;
  onUserLogin: (userData: User) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  isActive,
  onMessage,
  onUserLogin,
}) => {
  const [formData, setFormData] = useState<{
    displayName: string;
    email: string;
    password: string;
  }>({
    displayName: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    onMessage("Creating account...", "loading");

    try {
      const rawUserData: User = await registerUser(
        formData.email,
        formData.password,
        formData.displayName
      );

      const userData: User = {
        localId: rawUserData.localId,
        displayName: rawUserData.displayName || "N/A",
        email: rawUserData.email,
        idToken: rawUserData.idToken,
      };

      onMessage("Account created successfully!", "success");
      onUserLogin(userData);
    } catch (error: any) {
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
  useEffect(() => {
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
          minLength={6}
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
