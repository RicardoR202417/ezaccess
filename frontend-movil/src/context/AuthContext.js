import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const usuarioGuardado = await AsyncStorage.getItem('usuario');
        if (usuarioGuardado) {
          setUsuario(JSON.parse(usuarioGuardado));
        }
      } catch (error) {
        console.error('❌ Error al cargar usuario:', error);
      } finally {
        setCargando(false);
      }
    };
    cargarUsuario();
  }, []);

  // Función para iniciar sesión
  const login = async (datosUsuario) => {
    try {
      setUsuario(datosUsuario);
      await AsyncStorage.setItem('usuario', JSON.stringify(datosUsuario));
    } catch (error) {
      console.error('❌ Error al guardar sesión:', error);
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      setUsuario(null);
      await AsyncStorage.removeItem('usuario');
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, cargando }}>
      {children}
    </AuthContext.Provider>
  );
};