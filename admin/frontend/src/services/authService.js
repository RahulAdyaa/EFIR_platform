// admin/frontend/src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5002/api/admin/auth/'; // Ensure this matches your admin backend port

const login = async (email, password) => {
  const response = await axios.post(API_URL + 'login', { email, password });
  if (response.data.token) {
    localStorage.setItem('adminInfo', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('adminInfo');
};

const authService = {
  login,
  logout,
};

export default authService;