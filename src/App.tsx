import { useState } from "react";
import AuthContainer from "./components/AuthContainer";
import UserDashboard from "./components/UserDashboard";
import { GoogleSignInProvider } from "./contexts/GoogleSignInContext";
import "./App.css";

interface User {
  id: string;
  name: string;
  email: string;
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleUserLogin = (userData: User) => {
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
