import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

export default function NavBarMonitor() {
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
            <Nav.Link href="/logout">Cerrar Sesión</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}