import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../../services/api'; // Your axios instance
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores user object { id, name, email, role, token }
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        // Here, you'd typically verify the token with your backend
        // For simplicity, we'll assume token validity and set user from stored data
        try {
          // You might have an API endpoint like /api/auth/me to get user details from token
          const response = await api.get('/auth/me'); // Example: Fetch user details
          setUser(response.data.user);
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        } catch (error) {
          console.error('Failed to load user from token:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Assuming your login API returns { user: { id, name, email, role }, token }
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      setLoading(false);
      return true; // Indicate success
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      setLoading(false);
      throw error; // Re-throw to be caught by login page
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login'); // Redirect to login after logout
  };

  const isAdmin = user && (user.role === 'admin' || user.role === 'police_officer'); // Example for checking admin/officer roles

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};