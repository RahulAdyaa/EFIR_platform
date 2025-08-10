import React, { useState, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaPhoneAlt, FaIdCard } from 'react-icons/fa';
import axios from 'axios';

const RegisterPage = () => { // Removed 'login' prop as it wasn't used
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    aadhar: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState(''); // Renamed for clarity

  const { name, email, phone, aadhar, password, confirmPassword } = formData;

  const handleChange = (e) => {
    const { name: fieldName, value } = e.target;
    setFormData({ ...formData, [fieldName]: value });
    // Clear field-specific error when user starts typing
    if (errors[fieldName]) {
      setErrors({ ...errors, [fieldName]: '' });
    }
    // Clear global submit error when user interacts with the form
    if (submitError) {
      setSubmitError('');
    }
  };

  // Using useCallback to memoize the validation function
  // This is a micro-optimization, might not be strictly necessary here
  // but good practice for functions passed as props or in dependencies.
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const phoneRegex = /^\d{10}$/; // Ensured it's exactly 10 digits
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    const aadharRegex = /^\d{12}$/; // Ensured it's exactly 12 digits
    if (!aadhar.trim()) {
      newErrors.aadhar = 'Aadhar number is required';
    } else if (!aadharRegex.test(aadhar)) {
      newErrors.aadhar = 'Aadhar number must be 12 digits';
    }

    if (!password) { // No trim for password, as spaces might be intentional
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, email, phone, aadhar, password, confirmPassword]); // Dependencies for useCallback

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(''); // Clear previous submit errors

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5002/api/users/register', { // <--- CHANGE PORT HERE
        name,
        email,
        phone,
        aadhar,
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true
      });

      console.log('Registration successful:', response.data);
      navigate('/login', { state: { registrationSuccess: true, email: email } });
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
        setSubmitError(error.response.data?.message || `Registration failed with status: ${error.response.status}`);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser
        console.error('Error request:', error.request);
        setSubmitError('Registration failed: No response from server. Please check your network connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        setSubmitError(`An unexpected error occurred: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={8} lg={6} xl={5}> {/* Adjusted Col for better responsiveness on larger screens */}
          <Card className="shadow-sm">
            <Card.Body className="p-4 p-md-5"> {/* Added responsive padding */}
              <div className="text-center mb-4">
                <img
                  src="/assets/images/police-badge.png" // Make sure this path is correct relative to your public folder
                  alt="eFIR Logo"
                  width="80"
                  className="mb-3"
                />
                <h2 className="fw-bold">Create an Account</h2> {/* Updated font-weight class */}
                <p className="text-muted">Register to access the eFIR platform</p>
              </div>

              {submitError && <Alert variant="danger" onClose={() => setSubmitError('')} dismissible>{submitError}</Alert>}

              <Form onSubmit={handleSubmit} noValidate> {/* Added noValidate to disable browser default validation bubbles */}
                <Form.Group className="mb-3" controlId="formGroupName"> {/* Added controlId for accessibility */}
                  <Form.Label>Full Name</Form.Label>
                  <div className="input-group has-validation"> {/* Added has-validation for proper Bootstrap styling with errors */}
                    <span className="input-group-text">
                      <FaUser />
                    </span>
                    <Form.Control
                      type="text"
                      name="name"
                      value={name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      isInvalid={!!errors.name}
                      aria-describedby="nameHelpBlock"
                    />
                    <Form.Control.Feedback type="invalid" id="nameHelpBlock">
                      {errors.name}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGroupEmail">
                  <Form.Label>Email Address</Form.Label>
                  <div className="input-group has-validation">
                    <span className="input-group-text">
                      <FaEnvelope />
                    </span>
                    <Form.Control
                      type="email"
                      name="email"
                      value={email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      isInvalid={!!errors.email}
                      aria-describedby="emailHelpBlock"
                    />
                    <Form.Control.Feedback type="invalid" id="emailHelpBlock">
                      {errors.email}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formGroupPhone">
                      <Form.Label>Phone Number</Form.Label>
                      <div className="input-group has-validation">
                        <span className="input-group-text">
                          <FaPhoneAlt />
                        </span>
                        <Form.Control
                          type="tel" // Use type="tel" for phone numbers
                          name="phone"
                          value={phone}
                          onChange={handleChange}
                          placeholder="10-digit mobile"
                          isInvalid={!!errors.phone}
                          aria-describedby="phoneHelpBlock"
                        />
                        <Form.Control.Feedback type="invalid" id="phoneHelpBlock">
                          {errors.phone}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formGroupAadhar">
                      <Form.Label>Aadhar Number</Form.Label>
                      <div className="input-group has-validation">
                        <span className="input-group-text">
                          <FaIdCard />
                        </span>
                        <Form.Control
                          type="text" // Aadhar can be text, but pattern restricts to numbers
                          name="aadhar"
                          value={aadhar}
                          onChange={handleChange}
                          placeholder="12-digit Aadhar"
                          isInvalid={!!errors.aadhar}
                          pattern="\d{12}" // You can add pattern for native HTML validation if desired
                          title="Aadhar number must be 12 digits"
                          aria-describedby="aadharHelpBlock"
                        />
                        <Form.Control.Feedback type="invalid" id="aadharHelpBlock">
                          {errors.aadhar}
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3" controlId="formGroupPassword">
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
                      placeholder="Create a password"
                      isInvalid={!!errors.password}
                      aria-describedby="passwordHelpBlock"
                    />
                    <Form.Control.Feedback type="invalid" id="passwordHelpBlock">
                      {errors.password}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <Form.Group className="mb-4" controlId="formGroupConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <div className="input-group has-validation">
                    <span className="input-group-text">
                      <FaLock />
                    </span>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      isInvalid={!!errors.confirmPassword}
                      aria-describedby="confirmPasswordHelpBlock"
                    />
                    <Form.Control.Feedback type="invalid" id="confirmPasswordHelpBlock">
                      {errors.confirmPassword}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

                <div className="d-grid">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isLoading}
                    className="py-2"
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Registering...
                      </>
                    ) : (
                      'Register'
                    )}
                  </Button>
                </div>
              </Form>

              <div className="text-center mt-4">
                <p className="mb-0"> {/* Removed default margin */}
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;