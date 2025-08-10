import React, {
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface GoogleSignInContextType {
  isGoogleLoaded: boolean;
}

const GoogleSignInContext = createContext<GoogleSignInContextType | undefined>(
  undefined
);

export { GoogleSignInContext };

interface GoogleSignInProviderProps {
  children: ReactNode;
}

export const GoogleSignInProvider: React.FC<GoogleSignInProviderProps> = ({
  children,
}) => {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState<boolean>(false);

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
