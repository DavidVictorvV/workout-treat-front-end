import React, { createContext, useContext, useState, useEffect } from "react";

const GoogleSignInContext = createContext();

export const useGoogleSignIn = () => {
  const context = useContext(GoogleSignInContext);
  if (!context) {
    throw new Error(
      "useGoogleSignIn must be used within a GoogleSignInProvider"
    );
  }
  return context;
};

export const GoogleSignInProvider = ({ children }) => {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  useEffect(() => {
    const checkGoogleLoaded = () => {
      if (window.google && window.google.accounts) {
        setIsGoogleLoaded(true);
      } else {
        setTimeout(checkGoogleLoaded, 100);
      }
    };

    checkGoogleLoaded();
  }, []);

  return (
    <GoogleSignInContext.Provider value={{ isGoogleLoaded }}>
      {children}
    </GoogleSignInContext.Provider>
  );
};
