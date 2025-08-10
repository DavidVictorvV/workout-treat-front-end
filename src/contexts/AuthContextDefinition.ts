import { createContext } from 'react';

export interface AuthContextType {
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);