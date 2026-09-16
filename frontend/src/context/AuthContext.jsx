import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('hostelsync_token');
      const savedUser = localStorage.getItem('hostelsync_user');
      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          const res = await api.getCurrentUser();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('hostelsync_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Session check fallback to cached user or re-login');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res.success) {
      localStorage.setItem('hostelsync_token', res.token);
      localStorage.setItem('hostelsync_user', JSON.stringify(res.user));
      setUser(res.user);
      return res.user;
    }
  };

  const quickLogin = async (role) => {
    const res = await api.quickLogin(role);
    if (res.success) {
      localStorage.setItem('hostelsync_token', res.token);
      localStorage.setItem('hostelsync_user', JSON.stringify(res.user));
      setUser(res.user);
      return res.user;
    }
  };

  const logout = () => {
    localStorage.removeItem('hostelsync_token');
    localStorage.removeItem('hostelsync_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, quickLogin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
