import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

export default function LoginForm() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, contrasena: password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Sesión iniciada correctamente');
        // Redirigir a Dashboard
      } else {
        setError(data.mensaje || 'Credenciales incorrectas');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <Form onSubmit={handleLogin}>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group className="mb-3">
        <Form.Label>Usuario</Form.Label>
        <Form.Control
          type="text"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>

      <Button type="submit" className="btn-ez">
        Iniciar Sesión
      </Button>
    </Form>
  );
}
