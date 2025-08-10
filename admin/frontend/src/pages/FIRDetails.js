// admin/frontend/src/pages/FIRDetailsPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import firService from '../services/firService';
import authService from '../services/authService';
import moment from 'moment';

const FIRDetailsPage = () => {
    const { id } = useParams(); // Get FIR ID from URL parameters
    const navigate = useNavigate();
    const [fir, setFir] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFIRDetails = async () => {
            try {
                setLoading(true);
                const data = await firService.getFIRById(id); // Call the backend API
                setFir(data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch FIR details');
                setLoading(false);
            }
        };

        if (id) {
            fetchFIRDetails();
        }
    }, [id]); // Re-fetch if ID changes

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <h2 style={styles.contentTitle}>Loading FIR Details...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.container}>
                <h2 style={styles.contentTitle}>Error</h2>
                <p style={styles.error}>{error}</p>
                <button style={styles.backButton} onClick={() => navigate('/firs')}>Back to FIR List</button>
            </div>
        );
    }

    if (!fir) {
        return (
            <div style={styles.container}>
                <h2 style={styles.contentTitle}>FIR Not Found</h2>
                <button style={styles.backButton} onClick={() => navigate('/firs')}>Back to FIR List</button>
            </div>
        );
    }

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
                <h2 style={styles.contentTitle}>FIR Details: {fir.subject}</h2>
                <div style={styles.detailsBox}>
                    <p><strong>FIR ID:</strong> {fir._id}</p>
                    <p><strong>Complainant Name:</strong> {fir.complainantName}</p>
                    <p><strong>Complainant Contact:</strong> {fir.complainantContact}</p> {/* Assuming this exists */}
                    <p><strong>Complainant Address:</strong> {fir.complainantAddress}</p> {/* Assuming this exists */}
                    <p><strong>Subject:</strong> {fir.subject}</p>
                    <p><strong>Description:</strong> {fir.description}</p>
                    <p><strong>Location of Incident:</strong> {fir.incidentLocation}</p> {/* Assuming this exists */}
                    <p><strong>Date of Incident:</strong> {moment(fir.incidentDate).format('YYYY-MM-DD HH:mm')}</p> {/* Assuming this exists */}
                    <p><strong>Registered On:</strong> {moment(fir.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
                    <p><strong>Last Updated:</strong> {moment(fir.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</p>
                    <p><strong>Current Status:</strong> <span style={getStatusStyle(fir.status)}>{fir.status}</span></p>

                    {/* Add more fields as per your FIR model */}
                    {fir.accusedName && <p><strong>Accused Name:</strong> {fir.accusedName}</p>}
                    {fir.evidenceDescription && <p><strong>Evidence Description:</strong> {fir.evidenceDescription}</p>}
                    {/* ... other specific fields from your FIR model */}

                    {fir.adminComment && <p><strong>Admin Comments:</strong> {fir.adminComment}</p>}
                </div>
                <button style={styles.backButton} onClick={() => navigate('/firs')}>Back to FIR List</button>
            </div>
        </div>
    );
};

// Helper for status styling (can be shared or defined here)
const getStatusStyle = (status) => {
    switch (status) {
        case 'Resolved': return { color: 'green', fontWeight: 'bold' };
        case 'Dismissed': return { color: 'red', fontWeight: 'bold' };
        case 'Under Process': return { color: 'orange', fontWeight: 'bold' };
        default: return { color: 'black', fontWeight: 'bold' };
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
    contentTitle: {
        color: '#34495e',
        marginBottom: '20px',
    },
    detailsBox: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        maxWidth: '700px',
        margin: '20px auto',
        textAlign: 'left',
        lineHeight: '1.8',
    },
    backButton: {
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        marginTop: '20px',
        transition: 'background-color 0.3s ease',
    },
};

export default FIRDetailsPage;