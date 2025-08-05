// src/App.js
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  return (
    // Contexto global para manejo de autenticación
    <AuthProvider>
      {/* Proveedor para estilos y componentes de React Native Paper */}
      <PaperProvider>
        {/* Navegación principal de la app */}
        <AppNavigator />
      </PaperProvider>
    </AuthProvider>
  );
}
