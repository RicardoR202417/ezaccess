import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function NavBarMonitor() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Eliminar token y datos del usuario
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    // Opcional: notificar al backend
    fetch('http://localhost:3000/api/logout', {
      method: 'POST'
    });

    // Redirigir al login
    navigate('/login');
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-4 shadow-sm">
      <Container>
        <Navbar.Brand href="/dashboard">EZACCESS</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/dashboard">Inicio</Nav.Link>
            <Nav.Link href="/usuarios">Usuarios</Nav.Link>
            <Nav.Link href="/cajones">Cajones</Nav.Link>
            <Nav.Link href="/historial">Historial</Nav.Link>
            <Nav.Link href="/reportes">Reportes</Nav.Link>
            <Nav.Link onClick={handleLogout}>Cerrar Sesión</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
