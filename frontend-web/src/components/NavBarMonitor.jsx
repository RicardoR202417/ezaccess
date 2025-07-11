import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

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
        <Navbar.Brand href="/dashboard">EZACCESS</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/dashboard" className="btn-outline-custom">Dashboard</Nav.Link>
            <Nav.Link href="/usuarios" className="btn-outline-custom">Usuarios</Nav.Link>
            <Nav.Link href="/cajones" className="btn-outline-custom">Cajones</Nav.Link>
            <Nav.Link href="/reportes" className="btn-outline-custom">Reportes</Nav.Link>
          </Nav>
          <Button variant="outline-danger" onClick={cerrarSesion}>Cerrar sesión</Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
