/**
 * AuthContext
 * Provides static authentication state and mock user session.
 * Replaces dynamic AsyncStorage user storage with static in-memory user.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
}



const makeId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signUp: (name: string, email: string, password: string) => Promise<string | null>;
  logIn: (email: string, password: string) => Promise<string | null>;
  logOut: () => Promise<void>;
  updateUser: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // No pre-authenticated user
  const [user, setUser] = useState<User | null>(null);
  const isLoading = false;

  const signUp = useCallback(async (name: string, email: string, _password: string) => {
    const newUser: User = {
      id: makeId(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
    };
    setUser(newUser);
    return null;
  }, []);

  const logIn = useCallback(async (email: string, _password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const activeUser: User = {
      id: makeId(),
      name: cleanEmail.split('@')[0] || '',
      email: cleanEmail,
    };
    setUser(activeUser);
    return null;
  }, []);

  const logOut = useCallback(async () => {
    setUser(null);
  }, []);

  const updateUser = useCallback(async (name: string) => {
  setUser(prev => (prev ? { ...prev, name: name.trim() } : prev));
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      signUp,
      logIn,
      logOut,
      updateUser,
    }),
    [user, isLoading, signUp, logIn, logOut, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
