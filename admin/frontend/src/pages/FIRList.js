// admin/frontend/src/pages/FIRList.js
import React, { useEffect, useState } from 'react';
import firService from '../services/firService';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import moment from 'moment'; // For date formatting

const FIRListPage = () => {
  const [firs, setFirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchFIRs();
  }, []);

  const fetchFIRs = async () => {
    try {
      setLoading(true);
      const data = await firService.getAllFIRs();
      setFirs(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch FIRs');
      setLoading(false);
    }
  };

  const handleStatusChange = async (firId, newStatus) => {
    try {
      await firService.updateFIRStatus(firId, newStatus);
      fetchFIRs(); // Refresh the list after update
      alert('FIR status updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update FIR status');
    }
  };
   const handleViewDetails = (firId) => { // <--- ADD THIS HANDLER
      navigate(`/firs/${firId}`); // Navigate to the new details page
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <h1 style={styles.appName}>E-FIR Admin</h1>
        <div>
          <button style={styles.navButton} onClick={() => navigate('/')}>Dashboard</button>
          <button style={styles.navButton} onClick={() => navigate('/firs')}>View FIRs</button>
          <button style={styles.navButton} onClick={() => navigate('/analytics')}>Analytics</button>
          <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <div style={styles.content}>
        <h2>All FIRs</h2>
        {loading ? (
          <p>Loading FIRs...</p>
        ) : error ? (
          <p style={styles.error}>{error}</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>FIR ID</th>
                <th style={styles.th}>Complainant Name</th>
                <th style={styles.th}>Subject</th>
                <th style={styles.th}>Registered On</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
  {firs.map((fir) => (
    <tr key={fir._id}>
      <td style={styles.td}>
        {/* Make FIR ID clickable */}
        <span
          onClick={() => handleViewDetails(fir._id)} // <--- This line is added/corrected
          style={styles.firIdLink} // Make sure you have this style defined for visual indication
        >
          {fir._id}
        </span>
      </td>
      <td style={styles.td}>{fir.complainantName}</td>
      <td style={styles.td}>{fir.subject}</td>
      <td style={styles.td}>{moment(fir.createdAt).format('YYYY-MM-DD HH:mm')}</td>
      <td style={styles.td}>
        <span style={getStatusStyle(fir.status)}>{fir.status}</span>
      </td>
      <td style={styles.td}>
        <select
          value={fir.status}
          onChange={(e) => handleStatusChange(fir._id, e.target.value)}
          style={styles.select}
        >
          <option value="Under Process">Under Process</option>
          <option value="Resolved">Resolved</option>
          <option value="Dismissed">Dismissed</option>
        </select>
      </td>
    </tr>
  ))}
</tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const getStatusStyle = (status) => {
    switch (status) {
      case 'Resolved':
        return { color: 'green', fontWeight: 'bold' };
      case 'Dismissed':
        return { color: 'red', fontWeight: 'bold' };
      case 'Under Process':
      default:
        return { color: 'orange', fontWeight: 'bold' };
    }
  };


const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f4f7f6',
        minHeight: '100vh',
    },
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 30px',
        backgroundColor: '#2c3e50',
        color: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    appName: {
        margin: 0,
        fontSize: '24px',
    },
    navButton: {
        backgroundColor: 'transparent',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        margin: '0 5px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s ease',
    },
    logoutButton: {
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        marginLeft: '15px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s ease',
    },
    content: {
        padding: '30px',
        textAlign: 'center',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
        backgroundColor: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        borderRadius: '8px',
        overflow: 'hidden',
    },
    th: {
        backgroundColor: '#34495e',
        color: 'white',
        padding: '12px 15px',
        textAlign: 'left',
        borderBottom: '1px solid #ddd',
    },
    td: {
        padding: '12px 15px',
        borderBottom: '1px solid #eee',
        textAlign: 'left',
    },
    select: {
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        backgroundColor: 'white',
        cursor: 'pointer',
        minWidth: '120px',
    },
    error: {
        color: 'red',
        fontWeight: 'bold',
    },
     firIdLink: { // <--- ADD THIS STYLE FOR THE LINK
        color: '#007bff',
        cursor: 'pointer',
        textDecoration: 'underline'},
};

export default FIRListPage;