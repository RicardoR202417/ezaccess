import React from 'react';
import LoginForm from '../components/LoginForm';
import logo from '../assets/logo.png';

export default function LoginPage() {
  return (
    <div className="form-container d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="mb-4 text-center">
        <img
          src={logo}
          alt="Logo del sistema"
          className="logo-login"
          style={{ width: '200px', height: '200px', objectFit: 'contain' }} // Tamaño ligeramente mayor
        />
      </div>
      <div className="form-box p-4 shadow-lg rounded bg-white" style={{ maxWidth: '480px', width: '100%' }}>
        <h2 className="form-title text-center mb-3">Inicio de Sesión</h2>
        <LoginForm />
      </div>
    </div>
  );
}
