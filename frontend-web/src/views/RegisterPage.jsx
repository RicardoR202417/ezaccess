import React from 'react';
import RegisterForm from '../components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="form-container d-flex justify-content-center align-items-center vh-100">
      <div className="form-box">
        <h2 className="form-title text-center mb-4">Registro de Usuario</h2>
        <RegisterForm />
      </div>
    </div>
  );
}
