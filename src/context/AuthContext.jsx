import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Demo admin credentials (in production, this would be handled by a backend)
const DEMO_ADMIN = {
  username: 'admin',
  password: 'admin123'
};

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('heritage_admin_auth');
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        if (authData.isAuthenticated && authData.user) {
          setIsAuthenticated(true);
          setUser(authData.user);
        }
      } catch (e) {
        localStorage.removeItem('heritage_admin_auth');
      }
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    // Simple demo authentication
    if (username === DEMO_ADMIN.username && password === DEMO_ADMIN.password) {
      const userData = {
        username,
        role: 'admin',
        loginTime: new Date().toISOString()
      };

      setIsAuthenticated(true);
      setUser(userData);

      // Persist to localStorage
      localStorage.setItem('heritage_admin_auth', JSON.stringify({
        isAuthenticated: true,
        user: userData
      }));

      return { success: true };
    }

    return { success: false, error: 'Invalid username or password' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('heritage_admin_auth');
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
