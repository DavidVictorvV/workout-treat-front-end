import { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import AuthContainer from "@/components/Authentification/AuthContainer";
import PageNavigator from "@/components/PageNavigator/PageNavigator";
import { GoogleSignInProvider } from "@/contexts/GoogleSignInContext";
import MainAppRouter from "@/routes/MainAppRouter";

import "./App.css";
import type { User } from "@/types/User";
import { PageIds } from "@/types/PageIds";

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<PageIds>(PageIds.Home);

  // Restore user session
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

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.page) {
        setCurrentPage(event.state.page);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setCurrentUser(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <GoogleSignInProvider>
      <Router>
        <div className="app">
          <div className="app-background">
            {currentUser ? (
              <>
                <MainAppRouter
                  currentPage={currentPage}
                  currentUser={currentUser}
                  onLogout={handleLogout}
                />
                <PageNavigator
                  isLoggedIn={!!currentUser}
                  currentPage={currentPage}
                  onNavigate={(page) => {
                    window.history.pushState({ page }, "", "/");
                    setCurrentPage(page);
                  }}
                />
              </>
            ) : (
              <div className="min-h-screen flex items-center justify-center">
                <AuthContainer
                  onUserLogin={(user) => {
                    setCurrentUser(user);
                    localStorage.setItem("loggedInUser", JSON.stringify(user));
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </Router>
    </GoogleSignInProvider>
  );
}

export default App;
