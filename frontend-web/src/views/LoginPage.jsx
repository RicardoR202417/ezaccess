import React from 'react';
import LoginForm from '../components/LoginForm';
import logo from '../assets/logo.png';

export default function LoginPage() {
  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="Logo del sistema" className="login-logo" />
        <h2 className="login-title">Inicio de Sesión</h2>
        <LoginForm />
      </div>
    </div>
  );
}
