// src/App.js
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';  // Verifica que esta importación sea correcta
import { AuthProvider } from './src/context/AuthContext';  // Verifica que esta importación sea correcta

export default function App() {
  return (
    <AuthProvider>  {/* Asegúrate de envolver el AppNavigator con AuthProvider */}
      <PaperProvider>
        <AppNavigator />
      </PaperProvider>
    </AuthProvider>
  );
}
