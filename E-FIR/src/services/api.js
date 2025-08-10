import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api', // **IMPORTANT: Replace with your actual backend API URL**
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor for handling token expiration/invalidity
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid, clear storage and redirect to login
      localStorage.removeItem('token');
      // Optionally, you can trigger a logout action from AuthContext here
      // This would require importing AuthContext and calling its logout method.
      // For now, a simple redirect:
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;