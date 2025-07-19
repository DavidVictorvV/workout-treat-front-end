import React, { useState } from "react";
import Logo from "./Logo";
import Message from "./Message";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { deleteAccount } from "../services/authService";

interface User {
  email: string;
  displayName?: string | null;
  localId: string;
  idToken: string;
  // add other user properties if needed
}

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
  const [message, setMessage] = useState<MessageType | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const handleMessage = (text: string, type: MessageType["type"]) => {
    setMessage({ text, type });
  };

  const clearMessage = () => {
    setMessage(null);
  };

  const handleLogout = () => {
    clearMessage();
    onLogout();
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
            {user.idToken.substring(0, 50)}...
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
