import React from 'react';
import LoginForm from '../components/LoginForm';
import logo from '../assets/logo.png';

export default function LoginPage() {
  return (
    <div className="form-container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="form-box p-4 shadow-lg rounded bg-white" style={{ maxWidth: '480px', width: '100%' }}>
        <div className="text-center mb-4">
          <img
            src={logo}
            alt="Logo del sistema"
            style={{
              width: '80px',
              height: '80px',
              objectFit: 'contain',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
            }}
          />
        </div>
        <h2 className="form-title text-center mb-3">Inicio de Sesión</h2>
        <LoginForm />
      </div>
    </div>
  );
}
