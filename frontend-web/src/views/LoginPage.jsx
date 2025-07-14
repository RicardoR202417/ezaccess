import React from 'react';
import LoginForm from '../components/LoginForm';
import logo from '../assets/logo.png';

export default function LoginPage() {
  return (
    <div className="login-wrapper d-flex flex-column align-items-center justify-content-center vh-100">
      <img 
        src={logo} 
        alt="Logo del sistema" 
        style={{ width: '140px', height: 'auto', marginBottom: '20px' }} 
      />

      <div 
        className="form-box p-5 shadow-lg rounded bg-white"
        style={{ maxWidth: '500px', width: '100%' }}
      >
        <h2 className="form-title text-center mb-4">Inicio de Sesión</h2>
        <LoginForm />
      </div>
    </div>
  );
}
