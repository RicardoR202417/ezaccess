import React from 'react';
import LoginForm from '../components/LoginForm';
import logo from '../assets/logo.png';

export default function LoginPage() {
  return (
    <div className="form-container">
      <img src={logo} alt="Logo del sistema" className="logo-login" />
      <div className="form-box">
        <h2 className="form-title text-center mb-4">Inicio de Sesión</h2>
        <LoginForm />
      </div>
    </div>
  );
}
