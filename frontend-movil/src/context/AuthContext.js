// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarToken = async () => {
      try {
        const datos = await AsyncStorage.getItem('usuario');
        if (datos) {
          setUsuario(JSON.parse(datos));
        }
      } catch (error) {
        console.error('❌ Error al cargar usuario desde almacenamiento:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarToken();
  }, []);

  const login = async (data) => {
    try {
      setUsuario(data);
      await AsyncStorage.setItem('usuario', JSON.stringify(data));
    } catch (error) {
      console.error('❌ Error al guardar sesión:', error);
    }
  };

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
