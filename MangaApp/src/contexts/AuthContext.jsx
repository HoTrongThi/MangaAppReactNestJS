import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext(null);

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check for user in localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      console.log('Found stored user:', storedUser);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const register = async (email, password, username, role) => {
    try {
      setError(null);
      setLoading(true);
      console.log('Attempting registration:', { email, username, role });
      
      const response = await api.post('/auth/register', {
        email,
        password,
        username,
        role
      });

      console.log('Registration response:', response.data);
      
      const userData = {
        token: response.data.access_token,
        ...response.data.user
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setLoading(false);
      navigate('/');
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      console.log('Attempting login:', { email });
      
      const response = await api.post('/auth/login', {
        email,
        password
      });

      console.log('Login response:', response.data);
      
      const userData = {
        token: response.data.access_token,
        ...response.data.user
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setLoading(false);
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    console.log('Logging out user');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, register, login, logout }}>
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