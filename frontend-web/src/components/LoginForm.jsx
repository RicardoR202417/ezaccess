// src/components/LoginForm.jsx
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { app } from '../firebaseConfig'; // <-- tu archivo en src/firebaseConfig.js

const BASE_URL = 'https://ezaccess-backend.onrender.com/api';

export default function LoginForm() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const guardarSesionYRedirigir = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    navigate('/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const { data } = await axios.post(`${BASE_URL}/login`, {
        correo,
        contrasena,
      });
      guardarSesionYRedirigir(data);
    } catch (err) {
      setError('Credenciales inválidas. Intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setCargando(true);

    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();

      // Solicita ID token de Google explícitamente
      provider.setCustomParameters({ prompt: 'select_account' });

      const result = await signInWithPopup(auth, provider);

      // ✅ ID token de Google (NO el de Firebase)
      const credential = GoogleAuthProvider.credentialFromResult(result);
      let idToken = credential?.idToken;

      // Fallback para algunas versiones del SDK
      if (!idToken && result?._tokenResponse?.oauthIdToken) {
        idToken = result._tokenResponse.oauthIdToken;
      }

      if (!idToken) {
        throw new Error('No se pudo obtener el Google ID token del popup.');
      }

      // Enviar ID token de Google a tu backend
      const resp = await fetch(`${BASE_URL}/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: idToken }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        console.log('❌ Error del backend (Google):', data);
        setError(data.error || 'Error al iniciar sesión con Google.');
        return;
      }

      guardarSesionYRedirigir(data);
    } catch (err) {
      console.error('❌ Error en login con Google:', err);
      setError(
        err?.message ||
          'Error al iniciar sesión con Google. Intenta nuevamente.'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form.Group className="mb-3" controlId="formCorreo">
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control
            type="email"
            placeholder="Ingresa tu correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="formContrasena">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
        </Form.Group>

        <div className="d-grid mb-3">
          <Button variant="primary" type="submit" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Iniciar Sesión'}
          </Button>
        </div>

        <div className="d-grid">
          <Button
            variant="danger"
            type="button"
            onClick={handleGoogleLogin}
            disabled={cargando}
          >
            {cargando ? 'Conectando con Google...' : 'Iniciar sesión con Google'}
          </Button>
        </div>
      </Form>
    </>
  );
}
