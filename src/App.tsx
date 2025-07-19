import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebaseConfig";

import AuthContainer from "./components/AuthContainer";
import UserDashboard from "./components/UserDashboard";
import PageNavigator from "./components/PageNavigator";

import HomePage from "./pages/HomePage";
import DummyPage1 from "./pages/DummyPage1";
import DummyPage2 from "./pages/DummyPage2";
import "./App.css";
import { GoogleSignInProvider } from "./contexts/GoogleSignInContext";

import type { User } from "./types/User";

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        setCurrentUser({
          localId: firebaseUser.uid,
          email: firebaseUser.email ?? "",
          displayName: firebaseUser.displayName,
          idToken: token,
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleUserLogin = (userData: User) => {
    setCurrentUser(userData);
  };

  const handleUserLogout = () => {
    setCurrentUser(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <GoogleSignInProvider>
      <Router>
        <div className="app">
          <div className="app-background">
            <Routes>
              {!currentUser ? (
                <Route
                  path="*"
                  element={<AuthContainer onUserLogin={handleUserLogin} />}
                />
              ) : (
                <>
                  <Route path="/" element={<Navigate to="/profile" />} />
                  <Route
                    path="/profile"
                    element={
                      <UserDashboard
                        user={currentUser}
                        onLogout={handleUserLogout}
                        onUserUpdate={() => {}}
                      />
                    }
                  />
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/page1" element={<DummyPage1 />} />
                  <Route path="/page2" element={<DummyPage2 />} />
                </>
              )}
            </Routes>
            <PageNavigator isLoggedIn={!!currentUser} />
          </div>
        </div>
      </Router>
    </GoogleSignInProvider>
  );
}

export default App;
