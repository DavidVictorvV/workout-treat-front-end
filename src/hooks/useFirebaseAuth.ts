import { useEffect, useState, useCallback } from 'react';
import { addAuthStateListener } from '@/services/firebaseAuth';
import type { User as FirebaseUser } from 'firebase/auth';
import type { User } from '@/types/User';

/**
 * Hook to handle Firebase authentication state and restore user sessions
 */
export const useFirebaseAuth = () => {
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = addAuthStateListener((user) => {
      setFirebaseUser(user);
      setIsFirebaseReady(true);

      if (user) {
        console.log('🔥 Firebase user restored from session:', user.email);
        console.log('🔄 Backend will provide all user data via API calls');
      } else {
        console.log('🔥 No Firebase user found');
      }
    });

    return unsubscribe;
  }, []);

  /**
   * Check if user should be automatically logged in based on Firebase auth state only
   */
  const shouldAutoLogin = useCallback((): boolean => {
    return !!firebaseUser;
  }, [firebaseUser]);

  /**
   * Get Firebase user info - backend will provide full user data
   */
  const getFirebaseUserInfo = useCallback((): User | null => {
    if (!firebaseUser) return null;

    // Return minimal user info - backend will provide complete data
    return {
      localId: firebaseUser.uid,
      email: firebaseUser.email || 'firebase-user',
      displayName: firebaseUser.displayName || 'Firebase User',
      idToken: 'provided-by-firebase' // Actual token handled by Firebase auth
    };
  }, [firebaseUser]);

  return {
    isFirebaseReady,
    firebaseUser,
    shouldAutoLogin,
    getFirebaseUserInfo,
  };
};