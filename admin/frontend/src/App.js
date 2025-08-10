// admin/frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import FIRListPage from './pages/FIRList';
import FIRDetailsPage from './pages/FIRDetails';
import AnalyticsPage from './pages/Analytics';
import PrivateRoute from './components/PrivateRoute'; // For protected routes

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/firs" element={<PrivateRoute><FIRListPage /></PrivateRoute>} />
          <Route path="/firs/:id" element={<PrivateRoute><FIRDetailsPage /></PrivateRoute>} /> {/* <--- ADD THIS NEW ROUTE */}
          <Route path="/analytics" element={<PrivateRoute><AnalyticsPage /></PrivateRoute>} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;