import { useState } from "react";
import AuthContainer from "./components/AuthContainer";
import UserDashboard from "./components/UserDashboard";
import { GoogleSignInProvider } from "./contexts/GoogleSignInContext";
import "./App.css";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const handleUserLogin = (userData) => {
    setCurrentUser(userData);
  };

  const handleUserLogout = () => {
    setCurrentUser(null);
  };

  return (
    <GoogleSignInProvider>
      <div className="app">
        <div className="app-background">
          {currentUser ? (
            <UserDashboard
              user={currentUser}
              onLogout={handleUserLogout}
              onUserUpdate={setCurrentUser}
            />
          ) : (
            <AuthContainer onUserLogin={handleUserLogin} />
          )}
        </div>
      </div>
    </GoogleSignInProvider>
  );
}

export default App;
