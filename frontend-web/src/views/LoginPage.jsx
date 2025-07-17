import React from 'react';
import LoginForm from '../components/LoginForm';
import logo from '../assets/logo.png';

export default function LoginPage() {
  return (
    <div className="login-wrapper">
      <div className="login-content">
        <img src={logo} alt="Logo del sistema" className="logo-fixed" />
        <h2 className="form-title">Inicio de Sesión</h2>
        <LoginForm />
      </div>
    </div>
  );
}
