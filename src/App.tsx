import { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import AuthContainer from "@/components/Authentification/AuthContainer";
import PageNavigator from "@/components/PageNavigator/PageNavigator";
import { GoogleSignInProvider } from "@/contexts/GoogleSignInContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { BackendDataProvider } from "@/contexts/BackendDataContext";
import MainAppRouter from "@/routes/MainAppRouter";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";

import "./App.css";
import type { User } from "@/types/User";
import { PageIds } from "@/types/PageIds";

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<PageIds>(PageIds.Home);
  const { isFirebaseReady, shouldAutoLogin, getFirebaseUserInfo } = useFirebaseAuth();

  // Check for auto-login from localStorage or Firebase
  useEffect(() => {
    const checkAutoLogin = () => {
      // First check for regular login auto-login
      const autoLogin = localStorage.getItem('autoLogin');
      const userData = localStorage.getItem('user');
      
      if (autoLogin === 'true' && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          if (parsedUser.rememberMe && parsedUser.token) {
            console.log('🔄 Auto-login from stored credentials');
            setCurrentUser(parsedUser);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.warn('⚠️ Failed to parse stored user data:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('autoLogin');
        }
      }
      
      // Fallback to Firebase auto-login if available
      if (!isFirebaseReady) {
        setLoading(false);
        return;
      }

      if (shouldAutoLogin()) {
        const firebaseUserInfo = getFirebaseUserInfo();
        if (firebaseUserInfo) {
          console.log('🔄 Firebase user authenticated - backend will provide user data');
          setCurrentUser(firebaseUserInfo);
          
          // Store Firebase user for token refresh
          localStorage.setItem('user', JSON.stringify({ ...firebaseUserInfo, token: firebaseUserInfo.idToken, rememberMe: true }));
          localStorage.setItem('autoLogin', 'true');
        }
      } else {
        console.log('🔄 No authentication found');
      }
      setLoading(false);
    };

    checkAutoLogin();
  }, [isFirebaseReady, shouldAutoLogin, getFirebaseUserInfo]);

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
    // Clear all localStorage data
    localStorage.removeItem('user');
    localStorage.removeItem('autoLogin');
    console.log('🔄 Logout: localStorage cleared');
    
    // Clear user state
    setCurrentUser(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <GoogleSignInProvider>
      <Router>
        <div className="app">
          <div className="app-background">
            {currentUser ? (
              <AuthProvider onLogout={handleLogout}>
                <BackendDataProvider>
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
                </BackendDataProvider>
              </AuthProvider>
            ) : (
              <AuthContainer
                onUserLogin={(user, rememberMe = false) => {
                  console.log('🔄 User authenticated - storing token for API calls');
                  setCurrentUser(user);
                  
                  if (rememberMe) {
                    // Store user data with token for persistent login
                    localStorage.setItem('user', JSON.stringify({ ...user, token: user.idToken, rememberMe: true }));
                    localStorage.setItem('autoLogin', 'true');
                    console.log('💾 User session saved for auto-login');
                  } else {
                    // Store user data with token for current session only
                    localStorage.setItem('user', JSON.stringify({ ...user, token: user.idToken, rememberMe: false }));
                    localStorage.removeItem('autoLogin');
                    console.log('💾 User session saved for current session only');
                  }
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
