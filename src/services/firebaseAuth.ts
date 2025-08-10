import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithCredential, 
  onAuthStateChanged, 
  setPersistence,
  browserLocalPersistence,
  type User as FirebaseUser 
} from 'firebase/auth';

// Firebase configuration - these should be set in your .env file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if Firebase is configured and log missing variables
const checkFirebaseConfiguration = () => {
  const configKeys = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN', 
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];
  
  const missing: string[] = [];
  const placeholder: string[] = [];
  
  Object.entries(firebaseConfig).forEach(([, value], index) => {
    const envVarName = configKeys[index];
    if (!value) {
      missing.push(envVarName);
    } else if (value === 'your-value-here') {
      placeholder.push(envVarName);
    }
  });
  
  if (missing.length > 0 || placeholder.length > 0) {
    console.error('🔥 Firebase configuration error:');
    if (missing.length > 0) {
      console.error('❌ Missing environment variables:', missing);
    }
    if (placeholder.length > 0) {
      console.error('❌ Placeholder values found (need real values):', placeholder);
    }
    console.error('💡 Create .env file from .env.example and add real Firebase config values');
    console.error('💡 Get Firebase config from: https://console.firebase.google.com/ > Project Settings > Web App');
    return false;
  }
  
  console.log('✅ Firebase configuration complete');
  return true;
};

const isFirebaseConfigured = checkFirebaseConfiguration();

let app: ReturnType<typeof initializeApp> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let currentFirebaseUser: FirebaseUser | null = null;
let authStateListeners: Array<(user: FirebaseUser | null) => void> = [];
let isInitialized = false;
let initializationPromise: Promise<boolean> | null = null;

// Initialize Firebase only if configured
const initializeFirebase = async (): Promise<boolean> => {
  if (isInitialized) return isFirebaseConfigured;
  if (initializationPromise) return await initializationPromise;

  initializationPromise = (async () => {
    if (!isFirebaseConfigured) {
      console.warn('🔥 Firebase not configured. Add Firebase config to .env file for automatic token refresh.');
      console.warn('💡 App will work with manual sign-in, but tokens will expire after 1 hour.');
      isInitialized = true;
      return false;
    }

    try {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      
      // Set persistence to keep user logged in across browser sessions
      await setPersistence(auth, browserLocalPersistence);
      
      // Wait for initial auth state to be determined
      await new Promise<void>((resolve) => {
        const unsubscribe = onAuthStateChanged(auth!, (user) => {
          currentFirebaseUser = user;
          if (user) {
            console.log('🔥 Firebase user authenticated:', user.email);
          } else {
            console.log('🔥 Firebase user signed out');
          }
          authStateListeners.forEach(listener => listener(user));
          unsubscribe(); // Only need this for initial state
          resolve();
        });
      });

      // Set up ongoing listener
      onAuthStateChanged(auth, (user) => {
        currentFirebaseUser = user;
        authStateListeners.forEach(listener => listener(user));
      });

      console.log('🔥 Firebase initialized successfully');
      isInitialized = true;
      return true;
    } catch (error) {
      console.error('🔥 Firebase initialization failed:', error);
      isInitialized = true;
      return false;
    }
  })();

  return await initializationPromise;
};

/**
 * Get a fresh Firebase ID token with automatic refresh
 */
export const getFirebaseIdToken = async (): Promise<string | null> => {
  try {
    const initialized = await initializeFirebase();
    if (!initialized || !currentFirebaseUser) {
      return null;
    }
    
    // This automatically refreshes the token if it's expired
    const token = await currentFirebaseUser.getIdToken(true);
    console.log('🔑 Got fresh Firebase token');
    return token;
  } catch (error) {
    console.error('❌ Error getting Firebase ID token:', error);
    return null;
  }
};

/**
 * Sign in with Google credential and store the Firebase user
 */
export const signInWithGoogleCredential = async (googleIdToken: string): Promise<FirebaseUser | null> => {
  const initialized = await initializeFirebase();
  if (!initialized) {
    console.warn('🔥 Firebase not configured, skipping Firebase sign-in');
    return null;
  }

  try {
    if (!auth) throw new Error('Auth not initialized');
    const credential = GoogleAuthProvider.credential(googleIdToken);
    const result = await signInWithCredential(auth, credential);
    console.log('🔥 Firebase sign-in successful');
    return result.user;
  } catch (error) {
    console.error('❌ Firebase sign-in failed:', error);
    return null;
  }
};

/**
 * Add a listener for auth state changes
 */
export const addAuthStateListener = (listener: (user: FirebaseUser | null) => void) => {
  authStateListeners.push(listener);
  // Call immediately with current state
  listener(currentFirebaseUser);
  
  // Return unsubscribe function
  return () => {
    authStateListeners = authStateListeners.filter(l => l !== listener);
  };
};

/**
 * Get the current Firebase user
 */
export const getCurrentFirebaseUser = (): FirebaseUser | null => {
  return currentFirebaseUser;
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<void> => {
  const initialized = await initializeFirebase();
  if (!initialized) {
    return;
  }

  try {
    if (auth) {
      await auth.signOut();
      console.log('🔥 Firebase sign-out successful');
    }
  } catch (error) {
    console.error('❌ Firebase sign-out failed:', error);
  }
};

/**
 * Check if Firebase is properly configured
 */
export const isFirebaseReady = (): boolean => {
  return isFirebaseConfigured;
};

export { auth };