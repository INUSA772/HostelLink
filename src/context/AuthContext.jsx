import { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import { storage } from '../utils/helpers';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]                   = useState(null);
  const [token, setToken]                 = useState(null); // ✅ token state added
  const [loading, setLoading]             = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const savedToken = storage.get('token');
      const savedUser  = storage.get('user');

      if (savedToken && savedUser) {
        setUser(savedUser);
        setToken(savedToken); // ✅ restore token on page refresh
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Get dashboard URL based on role
  const getDashboardUrl = (userRole) => {
    if (userRole === 'student') return '/dashboard';
    if (userRole === 'owner')   return '/landlord-dashboard';
    return '/';
  };

  // Login
  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      setToken(data.token);       // ✅ set token on login
      setIsAuthenticated(true);
      return {
        ...data,
        dashboardUrl: getDashboardUrl(data.user.role),
      };
    } catch (error) {
      throw error;
    }
  };

  // Register
  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      setUser(data.user);
      setToken(data.token);       // ✅ set token on register
      setIsAuthenticated(true);
      return {
        ...data,
        dashboardUrl: getDashboardUrl(data.user.role),
      };
    } catch (error) {
      throw error;
    }
  };

  // Logout
  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);               // ✅ clear token on logout
    setIsAuthenticated(false);
  };

  // Update user
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    storage.set('user', updatedUser);
  };

  const value = {
    user,
    token,            // ✅ exported so dashboard can use it
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    getDashboardUrl,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;