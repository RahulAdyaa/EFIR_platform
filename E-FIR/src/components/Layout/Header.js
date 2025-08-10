import React from 'react';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'; // Added Outlet
import { useAuth } from '../auth/AuthContext'; // Import useAuth hook
import { ROLES } from '../../utils/constants';


const Header = () => {
  const { user, logout, isAdmin,isAuthenticated, isAdminOrOfficer } = useAuth(); // Destructure from useAuth
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <Navbar bg="primary" variant="dark" expand="lg" className="py-2">
        <Container>
          <Navbar.Brand as={Link} to="/" className="efir-brand">
            <img
              src="/assets/images/police-badge.png"
              width="35"
              height="35"
              className="d-inline-block align-middle me-2"
              alt="eFIR Logo"
            />
            EFIR
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              {user ? (
                <>
                  <Nav.Link as={Link} to="/register-fir">Register FIR</Nav.Link>
                  <Nav.Link as={Link} to="/my-firs">My FIRs</Nav.Link>
                  <Nav.Link as={Link} to="/fir-enquiry">Check Status</Nav.Link>
                  {isAdmin && ( // Show Admin Portal link if user is admin/police officer
                    <Nav.Link as={Link} to="/admin/dashboard">Admin Portal</Nav.Link>
                  )}
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/fir-enquiry">General Enquiry</Nav.Link> {/* Changed to general enquiry if not logged in */}
                </>
              )}
            </Nav>
            <Nav>
              {user ? (
                <NavDropdown title={`Welcome, ${user.name}`} id="basic-nav-dropdown" align="end">
                  <NavDropdown.Item as={Link} to="/profile">My Profile</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <div className="d-flex">
                  <Button as={Link} to="/login" variant="outline-light" className="me-2 custom-button">Login</Button>
                  <Button as={Link} to="/register" variant="light" className="custom-button">Register</Button>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    {/* This is crucial for nested routes */}
    </>
  );
};

export default Header;