import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/layout.css'; // Asegúrate de importar tu CSS personalizado

export default function NavBarMonitor() {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={NavLink} to="/dashboard">EZACCESS</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              as={NavLink}
              to="/dashboard"
              className="nav-btn-custom"
            >
              Dashboard
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/usuarios"
              className="nav-btn-custom"
            >
              Usuarios
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/cajones"
              className="nav-btn-custom"
            >
              Cajones
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/reportes"
              className="nav-btn-custom"
            >
              Reportes
            </Nav.Link>
          </Nav>
          <Button variant="outline-danger" onClick={cerrarSesion}>Cerrar sesión</Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
