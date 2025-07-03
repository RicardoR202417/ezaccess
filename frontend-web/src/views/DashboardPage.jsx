import React from 'react';
import NavBarMonitor from '../components/NavBarMonitor';
import { Container, Row, Col, Card } from 'react-bootstrap';

export default function DashboardPage() {
  return (
    <>
      <NavBarMonitor />
      <Container>
        <h2 className="form-title text-center">Panel Principal</h2>
        <Row className="mt-4">
          <Col md={6} lg={4} className="mb-4">
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title>Gestión de Usuarios</Card.Title>
                <Card.Text>Registra, edita o da de baja usuarios (residentes y monitores).</Card.Text>
                <a href="/usuarios" className="btn btn-ez">Ir a usuarios</a>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={4} className="mb-4">
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title>Mapa de Cajones</Card.Title>
                <Card.Text>Visualiza el estado en tiempo real y asigna manualmente.</Card.Text>
                <a href="/cajones" className="btn btn-ez">Ver cajones</a>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={4} className="mb-4">
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title>Reportes</Card.Title>
                <Card.Text>Genera reportes por usuario, cajón y periodo.</Card.Text>
                <a href="/reportes" className="btn btn-ez">Ir a reportes</a>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
