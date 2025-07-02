import React from 'react';
import LoginForm from '../components/LoginForm';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  return (
    <div className="admin-container">
      <h2 className="form-title">EZACCESS - Ingreso de Monitor</h2>
      <LoginForm />
      <div className="text-center mt-4">
        <span>¿No tienes cuenta? </span>
        <Link to="/registro">Regístrate aquí</Link>
      </div>
    </div>
  );
}
