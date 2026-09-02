import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export function useAuth() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('acadsync_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (user) {
      localStorage.setItem('acadsync_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('acadsync_user');
    }
  }, [user]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('acadsync_user');
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setIsLoggingIn(true);
      setAuthError('');
      const data = await api.login(email, password);
      localStorage.setItem('token', data.token);
      const userData = data.user || { email, name: email.split('@')[0] };
      setUser(userData);
      return userData;
    } catch (err) {
      console.error('Login error:', err);
      const errorMsg = err.error || 'Login failed. Please check credentials.';
      setAuthError(errorMsg);
      if (err.unauthorized) {
        logout();
      }
      throw new Error(errorMsg);
    } finally {
      setIsLoggingIn(false);
    }
  }, [logout]);

  const register = useCallback(async (name, email, password) => {
    try {
      setIsLoggingIn(true);
      setAuthError('');
      await api.register(name, email, password);
      // Auto-login after successful registration
      const data = await api.login(email, password);
      localStorage.setItem('token', data.token);
      const userData = data.user || { email, name };
      setUser(userData);
      return userData;
    } catch (err) {
      console.error('Register error:', err);
      const errorMsg = err.error || 'Registration failed. Please try again.';
      setAuthError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoggingIn(false);
    }
  }, []);

  return { user, isLoggingIn, authError, login, register, logout, setAuthError };
}
