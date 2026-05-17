import React, { createContext, useState, useEffect, useContext } from 'react';
import type { IUser, LoginPayload, RegisterPayload } from '../types/index';
import * as authApi from '../api/auth.api';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  login: (data: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('gigflow_token');
      const storedUserStr = localStorage.getItem('gigflow_user');

      if (storedToken) {
        setToken(storedToken);
        if (storedUserStr) {
          try {
            setUser(JSON.parse(storedUserStr));
          } catch {
            // fail silently and re-verify
          }
        }
        
        try {
          // Re-verify the session with backend
          const response = await authApi.getMe();
          if (response.success && response.data?.user) {
            setUser(response.data.user);
            localStorage.setItem('gigflow_user', JSON.stringify(response.data.user));
          }
        } catch (error) {
          console.error('Session validation failed:', error);
          // Token expired or invalid
          localStorage.removeItem('gigflow_token');
          localStorage.removeItem('gigflow_user');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (data: LoginPayload) => {
    setIsLoading(true);
    try {
      const response = await authApi.loginUser(data);
      if (response.success && response.data) {
        const { token: receivedToken, user: receivedUser } = response.data;
        setToken(receivedToken);
        setUser(receivedUser);
        localStorage.setItem('gigflow_token', receivedToken);
        localStorage.setItem('gigflow_user', JSON.stringify(receivedUser));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterPayload) => {
    setIsLoading(true);
    try {
      const response = await authApi.registerUser(data);
      if (response.success && response.data) {
        const { token: receivedToken, user: receivedUser } = response.data;
        setToken(receivedToken);
        setUser(receivedUser);
        localStorage.setItem('gigflow_token', receivedToken);
        localStorage.setItem('gigflow_user', JSON.stringify(receivedUser));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('gigflow_token');
    localStorage.removeItem('gigflow_user');
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isLoading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
