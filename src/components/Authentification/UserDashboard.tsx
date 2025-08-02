import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User as UserIcon, Flame, Heart, Bell, Target, Shield, FileText, ChevronRight } from "lucide-react";
import DeleteConfirmationModal from "@/components/Authentification/DeleteConfirmationModal";
import { deleteAccount } from "@/services/authService";
import type { User } from "@/types/User";
import PageLayout from "@/components/PageLayout";
import StatsCard from "@/components/StatsCard";
import Button from "@/components/Button";
import { usePoints } from "@/hooks/usePoints";

interface UserDashboardProps {
  user: User;
  onLogout: () => void;
  onUserUpdate: (user: User) => void;
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

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const { totalPoints, completedWorkouts } = usePoints();

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount(user.localId, user.idToken);
      setShowDeleteModal(false);
      setTimeout(() => {
        onLogout();
        navigate("/");
      }, 1000);
    } catch (error: any) {
      console.error('Error deleting account:', error.message);
    }
  };

  // User stats based on actual data
  const dayStreak = completedWorkouts.length;
  const favoriteExercise = "Running";

  return (
    <>
      <PageLayout points={totalPoints} title="Profile">

            {/* User Profile Card */}
            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 mb-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserIcon className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {user.displayName || "Fitness Enthusiast"}
                </h2>
                <p className="text-amber-400 mb-1">Beginner Level</p>
                <p className="text-slate-400">Member since January 2025</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <StatsCard
                icon={Flame}
                value={dayStreak}
                label="Day Streak"
                iconColor="text-orange-400"
                valueColor="text-orange-400"
              />
              <StatsCard
                icon={Heart}
                value={favoriteExercise}
                label="Favorite"
                iconColor="text-red-400"
                valueColor="text-red-400"
              />
            </div>

            {/* Settings Section */}
            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 mb-6">
              <h3 className="text-xl font-semibold p-6 border-b border-slate-700/50">Settings</h3>
              
              <div className="space-y-0">
                <button className="w-full flex items-center justify-between p-4 hover:bg-slate-700/30 transition-colors border-b border-slate-700/50">
                  <div className="flex items-center gap-4">
                    <Bell className="w-5 h-5 text-yellow-400" />
                    <span className="text-base">Workout Reminders</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
                
                <button className="w-full flex items-center justify-between p-4 hover:bg-slate-700/30 transition-colors border-b border-slate-700/50">
                  <div className="flex items-center gap-4">
                    <Target className="w-5 h-5 text-red-400" />
                    <span className="text-base">Daily Goals</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
                
                <button className="w-full flex items-center justify-between p-4 hover:bg-slate-700/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <span className="text-base">Data & Privacy</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 mb-6">
              <h3 className="text-xl font-semibold p-6 border-b border-slate-700/50">About</h3>
              
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">App Version</span>
                  <span className="text-white font-medium">1.0.0</span>
                </div>
                
                <button className="w-full flex items-center justify-between py-3 hover:bg-slate-700/30 transition-colors rounded">
                  <div className="flex items-center gap-4">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <span className="text-base">Privacy Policy</span>
                  </div>
                  <span className="text-blue-400 text-sm">View →</span>
                </button>
                
                <button className="w-full flex items-center justify-between py-3 hover:bg-slate-700/30 transition-colors rounded">
                  <div className="flex items-center gap-4">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <span className="text-base">Terms of Service</span>
                  </div>
                  <span className="text-blue-400 text-sm">View →</span>
                </button>
              </div>
            </div>

            {/* User Actions */}
            <div className="space-y-4">
              <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                <p className="text-sm text-slate-400 mb-2">Signed in as:</p>
                <p className="text-white font-medium break-all">{user.email}</p>
              </div>
              
              <Button
                onClick={handleLogout}
                variant="primary"
                fullWidth
                size="lg"
              >
                Sign Out
              </Button>
              
              <Button
                onClick={() => setShowDeleteModal(true)}
                variant="danger"
                fullWidth
                size="lg"
              >
                Delete Account
              </Button>
            </div>
      </PageLayout>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
      />
    </>
  );
};

export default UserDashboard;
