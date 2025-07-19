import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import Message from "@/components/Message";
import DeleteConfirmationModal from "@/components/Authentification/DeleteConfirmationModal";
import { deleteAccount } from "@/services/authService";
import type { User } from "@/types/User";

interface UserDashboardProps {
  user: User;
  onLogout: () => void;
  onUserUpdate: (user: User) => void;
}

interface MessageType {
  text: string;
  type: "success" | "error" | "loading" | "info";
}

const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  onLogout,
  onUserUpdate,
}) => {
  // Silence unused onUserUpdate prop warning:
  React.useEffect(() => {
    // intentionally do nothing but silence the unused prop
    void onUserUpdate;
  }, [onUserUpdate]);

  const [message, setMessage] = useState<MessageType | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleMessage = (text: string, type: MessageType["type"]) => {
    setMessage({ text, type });
  };

  const clearMessage = () => {
    setMessage(null);
  };

  const handleLogout = () => {
    clearMessage();
    onLogout();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount(user.localId, user.idToken);
      setShowDeleteModal(false);
      handleMessage(
        "Account deleted successfully. You will be logged out.",
        "success"
      );

      setTimeout(() => {
        onLogout();
        navigate("/");
      }, 2000);
    } catch (error: any) {
      handleMessage(`Error deleting account: ${error.message}`, "error");
    }
  };

  return (
    <>
      <div className="auth-container">
        <Logo />

        {message && <Message text={message.text} type={message.type} />}

        <div className="user-info">
          <h3>Welcome! 🎉</h3>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Name:</strong> {user.displayName || "N/A"}
          </p>
          <p>
            <strong>User ID:</strong> {user.localId}
          </p>
          <div className="token">
            <strong>Firebase Token:</strong>
            <br />
            {user.idToken?.substring(0, 50)}...
          </div>
          <div className="user-actions">
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
            <button
              className="delete-btn"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
      />
    </>
  );
};

export default UserDashboard;
