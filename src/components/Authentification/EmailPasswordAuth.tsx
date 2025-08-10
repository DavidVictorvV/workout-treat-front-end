import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import Button from '@/components/Button';
import { signInWithEmailPassword, createUserWithEmailPassword } from '@/services/firebaseAuth';
import type { User as UserType } from '@/types/User';

interface EmailPasswordAuthProps {
  onMessage: (text: string, type: "success" | "error" | "loading") => void;
  onUserLogin: (userData: UserType, rememberMe?: boolean) => void;
}

type AuthMode = 'signin' | 'signup';

const EmailPasswordAuth: React.FC<EmailPasswordAuthProps> = ({
  onMessage,
  onUserLogin,
}) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getFirebaseErrorMessage = (error: unknown): string => {
    const firebaseError = error as { code?: string; message?: string };
    switch (firebaseError.code) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      default:
        return firebaseError.message || 'An unexpected error occurred.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      onMessage('Please fill in all fields', 'error');
      return;
    }

    if (mode === 'signup' && !displayName.trim()) {
      onMessage('Please enter your name', 'error');
      return;
    }

    setIsLoading(true);
    onMessage(mode === 'signin' ? 'Signing in...' : 'Creating account...', 'loading');

    try {
      let firebaseUser;
      
      if (mode === 'signin') {
        firebaseUser = await signInWithEmailPassword(email.trim(), password, keepSignedIn);
      } else {
        firebaseUser = await createUserWithEmailPassword(
          email.trim(), 
          password, 
          displayName.trim(),
          keepSignedIn
        );
      }

      if (!firebaseUser) {
        throw new Error('Authentication failed');
      }

      // Create User object from Firebase user data
      const userData: UserType = {
        localId: firebaseUser.uid,
        displayName: firebaseUser.displayName || displayName.trim() || "",
        email: firebaseUser.email || "",
        idToken: await firebaseUser.getIdToken(),
      };

      onMessage(
        mode === 'signin' 
          ? 'Welcome back! Signed in successfully!' 
          : 'Account created successfully! Welcome!', 
        'success'
      );
      
      onUserLogin(userData, keepSignedIn);
    } catch (error: unknown) {
      const message = getFirebaseErrorMessage(error);
      onMessage(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setEmail('');
    setPassword('');
    setDisplayName('');
    onMessage('', 'success'); // Clear any existing messages
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-white mb-1">
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </h3>
          <p className="text-slate-400 text-sm">
            {mode === 'signin' 
              ? 'Welcome back! Please sign in to continue.' 
              : 'Join us to start tracking your workouts!'}
          </p>
        </div>

        {mode === 'signup' && (
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Full Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>
        )}

        <div className="relative">
          <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-12 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-slate-400 hover:text-slate-300"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="keepSignedIn"
            checked={keepSignedIn}
            onChange={(e) => setKeepSignedIn(e.target.checked)}
            className="w-4 h-4 text-amber-600 bg-slate-700 border-slate-600 rounded focus:ring-amber-500 focus:ring-2"
            disabled={isLoading}
          />
          <label htmlFor="keepSignedIn" className="text-sm text-slate-300">
            Keep me signed in
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={isLoading}
        >
          {isLoading 
            ? (mode === 'signin' ? 'Signing In...' : 'Creating Account...') 
            : (mode === 'signin' ? 'Sign In' : 'Create Account')
          }
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={toggleMode}
            className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
            disabled={isLoading}
          >
            {mode === 'signin' 
              ? "Don't have an account? Sign up" 
              : 'Already have an account? Sign in'
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailPasswordAuth;