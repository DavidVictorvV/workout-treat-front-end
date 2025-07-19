import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AuthContainer from "@/components/Authentification/AuthContainer";
import UserDashboard from "@/components/Authentification/UserDashboard";
import HomePage from "@/pages/HomePage";
import DummyPage1 from "@/pages/DummyPage1";
import DummyPage2 from "@/pages/DummyPage2";
import PageNavigator from "@/components/PageNavigator/PageNavigator";

import { GoogleSignInProvider } from "@/contexts/GoogleSignInContext";
import "./App.css";
import type { User } from "@/types/User";

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        console.log("Restored user from localStorage:", parsedUser.email);
        setCurrentUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem("loggedInUser");
      }
    } else {
      console.log("No user found in localStorage");
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setCurrentUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <GoogleSignInProvider>
      <Router>
        <div className="app">
          <div className="app-background">
            {currentUser ? (
              <>
                <Routes>
                  {/* your routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/dummy1" element={<DummyPage1 />} />
                  <Route path="/dummy2" element={<DummyPage2 />} />
                  <Route
                    path="/profile"
                    element={
                      <UserDashboard
                        user={currentUser}
                        onLogout={handleLogout}
                        onUserUpdate={() => {}}
                      />
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <PageNavigator isLoggedIn={!!currentUser} />
              </>
            ) : (
              <AuthContainer
                onUserLogin={(user) => {
                  setCurrentUser(user);
                  localStorage.setItem("loggedInUser", JSON.stringify(user));
                }}
              />
            )}
          </div>
        </div>
      </Router>
    </GoogleSignInProvider>
  );
}

export default App;
