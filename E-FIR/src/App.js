import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './assets/App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Pages & Components
import Header from './components/common/Header';
import HomePage from './pages/HomePage';
import RegisterFIRPage from './pages/RegisterFIRPage';
import MYFIRsPage from './pages/MYFIRsPage';
import FIREnquiryPage from './pages/FIREnquiryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EnquiryPage from './pages/EnquiryPage';
import FIRDetailsPage from './pages/FIRDetailsPage';
import ProfilePage from './pages/ProfilePage';
import BotpressChatbot from './components/BotpressChatbot';

// Admin imports (adjust paths as needed)
// import AdminLayout from './components/Admin/AdminLayout';
// import AdminDashboard from './pages/Admin/AdminDashboard';
// import FIRManagement from './pages/Admin/FIRManagement';
// import FIRDetail from './pages/Admin/FIRDetails';
// import UserManagement from './pages/Admin/UserManagement'; // Optional
// import { ROLES } from './utils/constants'; // Adjust the import path as needed

// Layout wrapper for public routes with header
const PublicLayout = ({ user, logout }) => (
  <>
    <Header user={user} logout={logout} />
    <Outlet />
  </>
);

// Protected route component for authentication
const ProtectedRoute = ({ children }) => {
  const storedUser = localStorage.getItem('user');
  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Admin protected route with role check
const PrivateRoute = ({ allowedRoles, children }) => {
  const storedUser = localStorage.getItem('user');
  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }
  const user = JSON.parse(storedUser);
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for stored user on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.token) {
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('user');
        }
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (userData) => {
    const userToStore = {
      ...(userData.user || {}),
      token: userData.token
    };
    localStorage.setItem('user', JSON.stringify(userToStore));
    setUser(userToStore);
    setIsAuthenticated(true);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user function for profile changes
  const updateUser = (updatedUserData) => {
    const updatedUser = {
      ...user,
      ...updatedUserData
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public Routes with Header */}
        <Route element={<PublicLayout user={user} logout={logout} />}>
          <Route path="/" element={<HomePage user={user} logout={logout} />} />
          <Route path="/enquiry" element={<EnquiryPage user={user} logout={logout} />} />
          <Route path="/register-fir" element={
            <ProtectedRoute>
              <RegisterFIRPage user={user} logout={logout} />
            </ProtectedRoute>
          } />
          <Route path="/my-firs" element={
            <ProtectedRoute>
              <MYFIRsPage user={user} logout={logout} />
            </ProtectedRoute>
          } />
          <Route path="/fir-enquiry" element={
            <ProtectedRoute>
              <FIREnquiryPage user={user} logout={logout} />
            </ProtectedRoute>
          } />
          <Route path="/fir-details/:id" element={
            <ProtectedRoute>
              <FIRDetailsPage user={user} logout={logout} />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage user={user} logout={logout} updateUser={updateUser} />
            </ProtectedRoute>
          } />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage login={login} />} />
        <Route path="/register" element={<RegisterPage login={login} />} />

        
        {/* 404 Fallback */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
      <BotpressChatbot />
    </>
  );
}

export default App;