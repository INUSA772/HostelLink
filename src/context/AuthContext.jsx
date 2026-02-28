import { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService'; // Real service, not mock!
import { storage } from '../utils/helpers';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = () => {
      const token = storage.get('token');
      const savedUser = storage.get('user');
      
      if (token && savedUser) {
        setUser(savedUser);
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // ✅ NEW: Get dashboard URL based on role
  const getDashboardUrl = (userRole) => {
    if (userRole === 'student') {
      return '/dashboard';
    } else if (userRole === 'owner') {
      return '/landlord-dashboard';
    }
    return '/';
  };

  // Login
  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      setIsAuthenticated(true);
      
      // ✅ NEW: Return dashboard URL along with data
      return {
        ...data,
        dashboardUrl: getDashboardUrl(data.user.role)
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
      setIsAuthenticated(true);
      
      // ✅ NEW: Return dashboard URL along with data
      return {
        ...data,
        dashboardUrl: getDashboardUrl(data.user.role)
      };
    } catch (error) {
      throw error;
    }
  };

  // Logout
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    storage.set('user', updatedUser);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    getDashboardUrl  // ✅ NEW: Export function for use in components
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;