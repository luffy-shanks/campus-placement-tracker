// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cpt_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      localStorage.removeItem('cpt_user');
    }
    setLoading(false);
  }, []);

  /**
   * Mock login. In production, replace with an API call.
   * Returns { success, user?, error? }
   */
  const login = async (email, password) => {
    try {
      const safeUser = await authService.login(email, password);
      setUser(safeUser);
      localStorage.setItem('cpt_user', JSON.stringify(safeUser));
      return { success: true, user: safeUser };
    } catch (error) {
      return { success: false, error: error.message || 'Unable to log in.' };
    }
  };

  /**
   * Mock register – creates a student session.
   */
  const registerStudent = async data => {
    try {
      const newUser = await authService.register(data);
      setUser(newUser);
      localStorage.setItem('cpt_user', JSON.stringify(newUser));
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message || 'Unable to register.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cpt_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, registerStudent }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
