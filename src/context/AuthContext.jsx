import { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import { storage } from '../utils/helpers';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]                   = useState(null);
  const [token, setToken]                 = useState(null);
  const [loading, setLoading]             = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const savedToken = storage.get('token');
      const savedUser  = storage.get('user');

      if (savedToken && savedUser) {
        setUser(savedUser);
        setToken(savedToken);
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const getDashboardUrl = (userRole) => {
    if (userRole === 'admin')   return '/admin';           // ← added
    if (userRole === 'student') return '/dashboard';
    if (userRole === 'owner')   return '/landlord-dashboard';
    return '/';
  };

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      setToken(data.token);
      setIsAuthenticated(true);
      return {
        ...data,
        dashboardUrl: getDashboardUrl(data.user.role),
      };
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);

      // Owner needs OTP — do NOT log them in yet
      if (data.requiresOtp) {
        return data;
      }

      // Student — log in immediately
      setUser(data.user);
      setToken(data.token);
      setIsAuthenticated(true);
      return {
        ...data,
        dashboardUrl: getDashboardUrl(data.user.role),
      };
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    storage.set('user', updatedUser);
  };

  const value = {
    user,
    token,
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