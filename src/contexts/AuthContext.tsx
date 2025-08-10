import React, { useCallback, type ReactNode } from 'react';
import { signOut as firebaseSignOut } from '@/services/firebaseAuth';
import { logout as clearTokenRefresh } from '@/services/apiService';
import { AuthContext } from './AuthContextDefinition';

interface AuthProviderProps {
  children: ReactNode;
  onLogout: () => void;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, onLogout }) => {
  const signOut = useCallback(async () => {
    // Clear token refresh timers and localStorage
    clearTokenRefresh();
    
    // Sign out from Firebase to clear auth state
    try {
      await firebaseSignOut();
      console.log('🔄 Firebase sign-out successful - user session cleared');
    } catch (error) {
      console.warn('Firebase sign-out not available:', error);
    }

    // Trigger logout in parent component
    onLogout();
  }, [onLogout]);

  return (
    <AuthContext.Provider value={{ signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

