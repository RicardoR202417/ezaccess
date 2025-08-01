import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import 'bootstrap-icons/font/bootstrap-icons.css';

// Vistas
import LoginPage from "./views/LoginPage";
import RegisterPage from "./views/RegisterPage";
import DashboardPage from "./views/DashboardPage";
import UsuariosPage from "./views/UsuariosPage";
import EditarUsuarioPage from "./views/EditarUsuarioPage";
import CajonesPage from "./views/CajonesPage";

// Contexto de sesión
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuarios"
            element={
              <ProtectedRoute>
                <UsuariosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuarios/editar/:id"
            element={
              <ProtectedRoute>
                <EditarUsuarioPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cajones"
            element={
              <ProtectedRoute>
                <CajonesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={
              <h1 style={{ textAlign: "center", marginTop: "50px" }}>
                Página no encontrada
              </h1>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
