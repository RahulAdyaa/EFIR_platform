// admin/frontend/src/pages/Analytics.js
import React, { useEffect, useState } from 'react';
import firService from '../services/firService';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import ChartComponent from '../components/ChartComponent';

const AnalyticsPage = () => {
  const [firStats, setFirStats] = useState(null);
  const [firTrend, setFirTrend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const stats = await firService.getFIRStats();
      setFirStats(stats);

      const trend = await firService.getFIRTrend();
      // Prepare data for line chart: { label: 'Jan 2023', count: 10 }
      const formattedTrend = trend.map(item => ({
        label: `${item._id.month}/${item._id.year}`,
        count: item.count
      }));
      setFirTrend(formattedTrend);

      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch analytics data');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const firStatsData = firStats
    ? {
        labels: ['Total', 'Resolved', 'Dismissed', 'Under Process'],
        datasets: [
          {
            label: 'Number of FIRs',
            data: [firStats.total, firStats.resolved, firStats.dismissed, firStats.underProcess],
            backgroundColor: ['#36A2EB', '#28a745', '#dc3545', '#ffc107'],
            borderColor: ['#36A2EB', '#28a745', '#dc3545', '#ffc107'],
            borderWidth: 1,
          },
        ],
      }
    : {};

    const firTrendData = firTrend
    ? {
        labels: firTrend.map(item => item.label),
        datasets: [
          {
            label: 'FIRs Registered',
            data: firTrend.map(item => item.count),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          },
        ],
      }
    : {};

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'FIR Statistics Overview',
      },
    },
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'FIRs Registered Over Time',
      },
    },
    scales: {
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Number of FIRs'
            }
        },
        x: {
            title: {
                display: true,
                text: 'Month/Year'
            }
        }
    }
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
        <h2>FIR Analytics</h2>
        {loading ? (
          <p>Loading analytics data...</p>
        ) : error ? (
          <p style={styles.error}>{error}</p>
        ) : (
          <div style={styles.chartsContainer}>
            <div style={styles.chartBox}>
              <ChartComponent type="pie" data={firStatsData} options={chartOptions} />
            </div>
            <div style={styles.chartBox}>
              <ChartComponent type="bar" data={firStatsData} options={chartOptions} />
            </div>
            {firTrend && firTrend.length > 0 && (
                <div style={styles.fullWidthChartBox}>
                    <ChartComponent type="line" data={firTrendData} options={lineChartOptions} />
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
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
        backgroundColor: '#1a3a6c',
        color: 'white',
        boxShadow: '0 2px 4px rgba(250, 239, 239, 0.1)',
    },
    appName: {
        margin: 0,
        fontSize: '30px',
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
    chartsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '30px',
        marginTop: '30px',
    },
    chartBox: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        width: '45%', // Adjust width as needed for two charts per row
        minWidth: '350px', // Minimum width for responsiveness
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullWidthChartBox: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        width: '95%', // Full width for the trend chart
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    error: {
        color: 'red',
        fontWeight: 'bold',
    },
};

export default AnalyticsPage;