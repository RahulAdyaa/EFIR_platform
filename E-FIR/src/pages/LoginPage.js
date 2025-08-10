import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaLock, FaUser } from 'react-icons/fa';
import axios from 'axios';

const LoginPage = ({ login }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError(''); // Clear previous errors

    try {
      // API call to authenticate user
      // Ensure your .env file in the React app's root has:
      // REACT_APP_API_URL=http://localhost:5001/api
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/users/login`,
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          withCredentials: true // Important for sessions/cookies if your backend uses them
        }
      );
      
      const userData = response.data;
      console.log('Login response:', userData);

      // It's good practice to validate the structure of userData
      if (!userData || !userData.user || !userData.token) {
        // If the server sends a 2xx status but the data isn't what's expected
        console.error('Invalid response structure from server:', userData);
        throw new Error('Login successful, but received unexpected data from server.');
      }

      // Call login function from App (passed as a prop)
      // This function should handle storing the user data and token globally (e.g., in Context or Redux)
      login(userData); // Pass the whole userData object which includes user and token

      // Redirect to dashboard or another appropriate page
      navigate('/'); // Or whatever your protected route is

    } catch (err) { // Changed variable name from 'error' to 'err' to avoid conflict with 'error' state
      console.error('Login error:', err);
      let errorMessage = 'Invalid email or password. Please try again.'; // Default user-friendly message

      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error data:', err.response.data);
        console.error('Error status:', err.response.status);
        // Use server's message if available and it's user-friendly, otherwise keep default
        errorMessage = err.response.data?.message || errorMessage;
      } else if (err.request) {
        // The request was made but no response was received
        console.error('Error request:', err.request);
        errorMessage = 'No response from server. Please check your network connection and try again.';
      } else {
        // Something happened in setting up the request that triggered an Error
        // or an error was thrown manually (like the "Invalid response structure" error)
        console.error('Error message:', err.message);
        if (err.message.startsWith('Login successful, but')) {
          errorMessage = err.message; // Show the specific error about unexpected data
        } else {
          errorMessage = 'An unexpected error occurred. Please try again.';
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={6} lg={5} xl={4}> {/* Adjusted column size for better fit */}
          <Card className="shadow-sm">
            <Card.Body className="p-4 p-md-5"> {/* Responsive padding */}
              <div className="text-center mb-4">
                <img
                  src="/assets/images/police-badge.png" // Ensure this path is correct in your public folder
                  alt="eFIR Logo"
                  width="80"
                  className="mb-3"
                />
                <h2 className="fw-bold">Login to eFIR</h2> {/* Use fw-bold for Bootstrap 5+ */}
                <p className="text-muted">Advanced FIR Management Platform</p>
              </div>
              
              {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
              
              <Form onSubmit={handleSubmit} noValidate> {/* noValidate to disable browser default validation */}
                <Form.Group className="mb-3" controlId="loginEmail">
                  <Form.Label>Email Address</Form.Label>
                  <div className="input-group has-validation"> {/* For Bootstrap's validation styling */}
                    <span className="input-group-text">
                      <FaUser />
                    </span>
                    <Form.Control
                      type="email"
                      name="email"
                      value={email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required // HTML5 validation (works with noValidate on Form if you want custom messages)
                      isInvalid={!!error && error.toLowerCase().includes('email')} // Basic error highlighting
                    />
                    {/* You can add Form.Control.Feedback for more specific field errors if needed */}
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-4" controlId="loginPassword">
                  <Form.Label>Password</Form.Label>
                  <div className="input-group has-validation">
                    <span className="input-group-text">
                      <FaLock />
                    </span>
                    <Form.Control
                      type="password"
                      name="password"
                      value={password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      isInvalid={!!error && error.toLowerCase().includes('password') && !error.toLowerCase().includes('email')} // Basic error highlighting
                    />
                  </div>
                </Form.Group>
                
                <div className="d-grid"> {/* For full-width button */}
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={isLoading}
                    className="py-2" // Added some padding
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Logging in...
                      </>
                    ) : 'Login'}
                  </Button>
                </div>
              </Form>
              
              <div className="text-center mt-4">
                <p className="mb-2"> {/* Adjusted margin */}
                  Don't have an account? <Link to="/register">Register</Link>
                </p>
                <p className="mb-0">
                  <small className="text-muted">
                    {/* Consider removing demo credentials or making them less prominent for a real app */}
                    {/* Demo credentials: user@example.com / password */}
                  </small>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;