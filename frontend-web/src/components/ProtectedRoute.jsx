import React from 'react';
import { Navigate } from 'react-router-dom';

// Este componente protege rutas privadas
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    // Si no hay token, redirige al login
    return <Navigate to="/login" replace />;
  }

  // Si hay sesión activa, renderiza la vista protegida
  return children;
}
