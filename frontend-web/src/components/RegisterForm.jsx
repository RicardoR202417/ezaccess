import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    tipo_usuario: '',
    nombres: '',
    apellido_paterno: '',
    apellido_materno: '',
    correo: '',
    password: '',
  });

  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3000/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMensaje("Registro exitoso.");
      } else {
        setMensaje(data.mensaje || "Error en el registro.");
      }
    } catch {
      setMensaje("Error de conexión con el servidor.");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {mensaje && <Alert variant="info">{mensaje}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Tipo de Usuario</Form.Label>
        <Form.Select name="tipo_usuario" onChange={handleChange} required>
          <option value="">Seleccionar...</option>
          <option value="residente">Residente</option>
          <option value="monitor">Monitor</option>
        </Form.Select>
      </Form.Group>

      <Row>
        <Col>
          <Form.Group>
            <Form.Label>Nombres</Form.Label>
            <Form.Control name="nombres" onChange={handleChange} required />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Apellido Paterno</Form.Label>
            <Form.Control name="apellido_paterno" onChange={handleChange} required />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Apellido Materno</Form.Label>
            <Form.Control name="apellido_materno" onChange={handleChange} required />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mt-3">
        <Form.Label>Correo Electrónico</Form.Label>
        <Form.Control type="email" name="correo" onChange={handleChange} required />
      </Form.Group>

      <Form.Group className="mt-3">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control type="password" name="password" onChange={handleChange} required />
      </Form.Group>

      <Button className="btn-ez mt-3" type="submit">
        Registrar Usuario
      </Button>
    </Form>
  );
}
