import React, { useState } from "react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <h3>⚠️ Delete Account</h3>
        <p>
          Are you sure you want to delete your account? This action cannot be
          undone and will permanently remove:
        </p>
        <ul className="text-left my-4 text-sm text-slate-300">
          <li>• Your user profile and settings</li>
          <li>• All workout history and progress</li>
          <li>• Fitness level and achievements</li>
          <li>• Points and streaks</li>
          <li>• Store purchases and activity</li>
        </ul>
        <p className="text-red-400 font-medium">
          This cannot be undone!
        </p>
        <div className="modal-actions">
          <button
            className="modal-btn cancel-btn"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className="modal-btn confirm-delete-btn"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Forever"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
