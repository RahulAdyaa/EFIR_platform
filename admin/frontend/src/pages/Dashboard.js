// admin/frontend/src/pages/Dashboard.js
import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const DashboardPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // State for typing animation
  const fullWelcomeText = "Welcome to the Admin Dashboard!";
  const [displayedWelcomeText, setDisplayedWelcomeText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < fullWelcomeText.length) {
      const timeout = setTimeout(() => {
        setDisplayedWelcomeText((prev) => prev + fullWelcomeText[index]);
        setIndex((prev) => prev + 1);
      }, 70); // Adjust typing speed here (milliseconds per character)
      return () => clearTimeout(timeout);
    }
  }, [index, fullWelcomeText]);

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <h1 style={styles.appName}>E-FIR Admin</h1>
        <div style={styles.navButtonsGroup}>
          <button style={styles.navButton} onClick={() => navigate('/')}>Dashboard</button>
          <button style={styles.navButton} onClick={() => navigate('/firs')}>View FIRs</button>
          <button style={styles.navButton} onClick={() => navigate('/analytics')}>Analytics</button>
          <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <div style={styles.content}>
        {/* Logo Image Placeholder */}
        <img
          src="/assets/police-badge.png" // <--- REPLACE THIS WITH YOUR LOGO IMAGE PATH
          alt="Admin Dashboard Logo"
          style={styles.logoImage}
        />

        {/* Animated Welcome Text */}
        <h2 style={styles.welcomeText}>{displayedWelcomeText}</h2>

        <p style={styles.subtitle}>Use the navigation above to manage FIRs and view analytics.</p>

        <div style={styles.cardContainer}>
          <div style={{ ...styles.card, ...styles.cardManageFIRS }} onClick={() => navigate('/firs')}>
            <h3 style={styles.cardTitle}>Manage FIRs</h3>
            <p style={styles.cardDescription}>View all registered FIRs and update their status.</p>
          </div>
          <div style={{ ...styles.card, ...styles.cardViewAnalytics }} onClick={() => navigate('/analytics')}>
            <h3 style={styles.cardTitle}>View Analytics</h3>
            <p style={styles.cardDescription}>See graphical data for FIR statistics.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Inter', sans-serif",
    backgroundColor: '#F0F2F5',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 60px',
    backgroundColor: '#1C2E4A',
    color: 'white',
    boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
    borderBottom: '5px solid #4CAF50',
  },
  appName: {
    margin: 0,
    fontSize: '32px',
    fontWeight: '800',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    color: '#E0F2F7',
  },
  navButtonsGroup: {
    display: 'flex',
    alignItems: 'center',
  },
  navButton: {
    backgroundColor: 'transparent',
    color: '#E0F2F7',
    border: 'none',
    padding: '14px 28px',
    margin: '0 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '17px',
    fontWeight: '600',
    transition: 'background-color 0.3s ease, color 0.3s ease, transform 0.2s ease',
  },
  logoutButton: {
    backgroundColor: '#E74C3C',
    color: 'white',
    border: 'none',
    padding: '14px 28px',
    marginLeft: '35px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '17px',
    fontWeight: '700',
    boxShadow: '0 4px 10px rgba(231, 76, 60, 0.3)',
    transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
  },
  content: {
    flexGrow: 1,
    padding: '70px 30px',
    textAlign: 'center',
    maxWidth: '1300px',
    margin: '0 auto',
  },
  logoImage: {
    display: 'block',
    margin: '0 auto 40px auto',
    width: '120px',
    height: 'auto',
    objectFit: 'contain',
    filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.1))',
  },
  welcomeText: {
    fontSize: '48px',
    color: '#1C2E4A',
    marginBottom: '25px',
    fontWeight: '800',
    letterSpacing: '-1px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.05)',
    minHeight: '58px', // Prevent layout shift during animation (adjust based on font size)
  },
  subtitle: {
    fontSize: '22px',
    color: '#5E6B7C',
    marginBottom: '70px',
    lineHeight: '1.7',
    fontWeight: '400',
  },
  cardContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '60px',
    marginTop: '60px',
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: '55px 45px',
    borderRadius: '18px',
    boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
    width: '450px',
    maxWidth: 'calc(50% - 30px)',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), background 0.4s ease',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  },
  cardManageFIRS: {
    background: 'linear-gradient(135deg, #42A5F5 0%, #2196F3 100%)',
    color: 'white',
    boxShadow: '0 15px 35px rgba(33, 150, 243, 0.35)',
  },
  cardViewAnalytics: {
    background: 'linear-gradient(135deg, #66BB6A 0%, #43A047 100%)',
    color: 'white',
    boxShadow: '0 15px 35px rgba(67, 160, 71, 0.35)',
  },
  cardTitle: {
    color: 'inherit',
    marginBottom: '20px',
    fontSize: '34px',
    fontWeight: '700',
    letterSpacing: '0.5px',
    textShadow: '1px 1px 3px rgba(0,0,0,0.2)',
  },
  cardDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '18px',
    lineHeight: '1.8',
    fontWeight: '300',
  },
};

export default DashboardPage;