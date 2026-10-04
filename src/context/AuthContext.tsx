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


// Generates a unique ID based on the current timestamp and a random number.
const makeId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;




// Defines the shape of the authentication context, including user information, loading state, and authentication methods.
interface AuthContextType {
  user: User | null;// Represents the currently authenticated user, or null if no user is logged in.
  isLoading: boolean;// Indicates whether an authentication operation is in progress.
  signUp: (name: string, email: string, password: string) => Promise<string | null>;// Handles user registration, returning a promise that resolves to an error message or null on success.
  logIn: (email: string, password: string) => Promise<string | null>;// Handles user login, returning a promise that resolves to an error message or null on success.
  logOut: () => Promise<void>;// Handles user logout, returning a promise that resolves when the operation is complete.
  updateUser: (name: string) => Promise<void>;// Updates the user's name, returning a promise that resolves when the operation is complete.
}
// Creates a context for authentication, initialized with undefined to indicate no default value.
const AuthContext = createContext<AuthContextType | undefined>(undefined);


// Provides the AuthContext to its children, managing user state and authentication methods.
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  
  const [user, setUser] = useState<User | null>(null);// Manages the current user state, initialized to null to indicate no user is logged in.
  const isLoading = false;// Represents whether an authentication operation is in progress, currently set to false as a placeholder.

  const signUp = useCallback(async (name: string, email: string, _password: string) => {// Handles user registration, creating a new user object and updating the state.
    const newUser: User = {// Creates a new user object with a unique ID, trimmed name, and lowercase email.
      id: makeId(),// Generates a unique ID for the new user.
      name: name.trim(),// Trims whitespace from the user's name.
      email: email.trim().toLowerCase(),// Trims whitespace and converts the email to lowercase for consistency.
    };

    // Updates the user state with the new user object, effectively logging in the newly registered user.
    setUser(newUser);// Returns null to indicate successful registration without errors.
    return null;  
  }, []);





  // Handles user login, creating a new user object based on the provided email and updating the state.
  const logIn = useCallback(async (email: string, _password: string) => {// Creates a new user object with a unique ID and a name derived from the email, then updates the state to log in the user.
    const cleanEmail = email.trim().toLowerCase();// Trims whitespace and converts the email to lowercase for consistency.
    const activeUser: User = {// Creates a new user object with a unique ID, a name derived from the email, and the cleaned email.
      id: makeId(),// Generates a unique ID for the logged-in user.
      name: cleanEmail.split('@')[0] || '',// Derives the user's name from the email by taking the part before the '@' symbol, defaulting to an empty string if not available.
      email: cleanEmail,// Sets the user's email to the cleaned email address.
    };


    // Updates the user state with the new user object, effectively logging in the user.
    setUser(activeUser);// Returns null to indicate successful login without errors.
    return null;
  }, []);



  // Handles user logout by clearing the user state, effectively logging out the current user.
  const logOut = useCallback(async () => {// Clears the user state, setting it to null to indicate no user is logged in.
    setUser(null);// Returns a resolved promise to indicate that the logout operation is complete.
  }, []);



  // Updates the user's name in the user state, allowing for changes to the user's display name.
  const updateUser = useCallback(async (name: string) => {// Updates the user's name in the user state, allowing for changes to the user's display name.
  setUser(prev => (prev ? { ...prev, name: name.trim() } : prev));// Updates the user state with the new name, trimming whitespace from the provided name. If no user is logged in, the state remains unchanged.
  }, []);// Returns a promise that resolves when the operation is complete, allowing for asynchronous handling of the update operation.



  // Memoizes the context value to optimize performance, preventing unnecessary re-renders of components that consume the AuthContext.
  const value = useMemo(
    () => ({
      user,// Represents the currently authenticated user, or null if no user is logged in.
      isLoading,// Indicates whether an authentication operation is in progress.
      signUp,// Handles user registration, returning a promise that resolves to an error message or null on success.
      logIn,// Handles user login, returning a promise that resolves to an error message or null on success.
      logOut,// Handles user logout, returning a promise that resolves when the operation is complete.
      updateUser,// Updates the user's name, returning a promise that resolves when the operation is complete.
    }),
    [user, isLoading, signUp, logIn, logOut, updateUser],// Specifies the dependencies for the useMemo hook, ensuring that the context value is recalculated only when these dependencies change.
  );// Returns the AuthContext.Provider component, providing the memoized context value to its children, allowing them to access authentication state and methods.



  // Renders the AuthContext.Provider component, passing the memoized context value and rendering its children, allowing them to access authentication state and methods.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};



// Custom hook to access the AuthContext, ensuring that it is used within an AuthProvider.
export const useAuth = () => {// Custom hook to access the AuthContext, ensuring that it is used within an AuthProvider.
  const ctx = useContext(AuthContext);// Retrieves the current context value for AuthContext using the useContext hook.
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');// Throws an error if the hook is used outside of an AuthProvider, enforcing proper usage of the context.
  return ctx;// Returns the context value, allowing components to access authentication state and methods.
};
