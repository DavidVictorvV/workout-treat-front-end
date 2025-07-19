import React, { useState } from "react";
import Logo from "./Logo";
import Message from "./Message";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { deleteAccount } from "../services/authService";

const UserDashboard = ({ user, onLogout, onUserUpdate }) => {
  const [message, setMessage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleMessage = (text, type) => {
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
    } catch (error) {
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
