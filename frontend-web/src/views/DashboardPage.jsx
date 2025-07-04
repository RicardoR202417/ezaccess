import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import NavBarMonitor from '../components/NavBarMonitor';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div>
      <NavBarMonitor />
      <Container className="mt-4">
        <h2 className="mb-4">Panel de Control</h2>
        <Row>
          <Col md={4} className="mb-3">
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>Gestión de Usuarios</Card.Title>
                <Card.Text>Administra y registra usuarios residentes y monitores del sistema.</Card.Text>
                <Button variant="primary" onClick={() => navigate('/usuarios')}>Ir a Usuarios</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>Estado de Cajones</Card.Title>
                <Card.Text>Visualiza los cajones disponibles, ocupados o reservados.</Card.Text>
                <Button variant="primary" onClick={() => navigate('/cajones')}>Ver Cajones</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>Reportes</Card.Title>
                <Card.Text>Consulta estadísticas de uso, frecuencia de entradas y salidas.</Card.Text>
                <Button variant="primary" onClick={() => navigate('/reportes')}>Ver Reportes</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}