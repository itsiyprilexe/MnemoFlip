import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  name: string;
  email: string;
}

interface StoredUser extends User {
  salt: string;
  hash: string;
}

const USERS_KEY = '@flashcards/users';
const SESSION_KEY = '@flashcards/session';

const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

// Prototype only: not real hashing. Swap for a proper hash (e.g. expo-crypto) or a backend later.
const hashPassword = async (salt: string, password: string) => `${salt}:${password}`;

const loadUsers = async (): Promise<StoredUser[]> => {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
};

const publicUser = ({ id, name, email }: StoredUser): User => ({ id, name, email });

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  /** Resolves to an error message, or null on success. */
  signUp: (name: string, email: string, password: string) => Promise<string | null>;
  logIn: (email: string, password: string) => Promise<string | null>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore the previous session on startup
  useEffect(() => {
    (async () => {
      try {
        const [sessionId, users] = await Promise.all([AsyncStorage.getItem(SESSION_KEY), loadUsers()]);
        const found = users.find((u) => u.id === sessionId);
        if (found) setUser(publicUser(found));
      } catch (e) {
        console.warn('Failed to restore session', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const users = await loadUsers();
      if (users.some((u) => u.email === cleanEmail)) {
        return 'An account with this email already exists.';
      }
      const salt = makeId();
      const created: StoredUser = {
        id: makeId(),
        name: name.trim(),
        email: cleanEmail,
        salt,
        hash: await hashPassword(salt, password),
      };
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify([...users, created]));
      await AsyncStorage.setItem(SESSION_KEY, created.id);
      setUser(publicUser(created));
      return null;
    } catch (e) {
      console.warn('signUp failed', e);
      return 'Could not create the account. Please try again.';
    }
  }, []);

  const logIn = useCallback(async (email: string, password: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const users = await loadUsers();
      let found = users.find((u) => u.email === cleanEmail);

      // Prototype mode: if the account doesn't exist, create it on the spot
      if (!found) {
        const salt = makeId();
        found = {
          id: makeId(),
          name: cleanEmail.split('@')[0] || 'Guest',
          email: cleanEmail,
          salt,
          hash: await hashPassword(salt, password),
        };
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify([...users, found]));
      }

      // Prototype mode: the password is not checked
      await AsyncStorage.setItem(SESSION_KEY, found.id);
      setUser(publicUser(found));
      return null;
    } catch (e) {
      console.warn('logIn failed', e);
      return 'Could not log in. Please try again.';
    }
  }, []);

  const logOut = useCallback(async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, signUp, logIn, logOut }),
    [user, isLoading, signUp, logIn, logOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('Useauth must be used within AuthProvider');
  return context;
};

