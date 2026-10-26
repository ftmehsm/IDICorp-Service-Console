
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
  } from "react";
  
  type AuthContextType = {
    isAuthenticated: boolean;
    isCheckingAuth: boolean;
    loginSuccess: () => void;
    logout: () => void;
  };
  
  const AuthContext = createContext<AuthContextType | null>(null);
  
  export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
    useEffect(() => {
      const token = sessionStorage.getItem("access_token");
  
      setIsAuthenticated(Boolean(token));
      setIsCheckingAuth(false);
    }, []);
  
    function loginSuccess() {
      setIsAuthenticated(true);
    }
  
    function logout() {
      sessionStorage.removeItem("access_token");
      setIsAuthenticated(false);
    }
  
    return (
      <AuthContext.Provider
        value={{ isAuthenticated, isCheckingAuth, loginSuccess, logout }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
  
  export function useAuth() {
    const context = useContext(AuthContext);
  
    if (!context) {
      throw new Error("useAuth must be used within AuthProvider");
    }
  
    return context;
  }
  