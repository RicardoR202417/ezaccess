import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Text } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../firebase/firebaseConfig';

export default function AsignacionCajon({ navigation }) {
  const [estado, setEstado] = useState(null);
  const [usuario, setUsuario] = useState(null); // ← info del usuario logueado

  useEffect(() => {
    const obtenerUsuario = async () => {
      const json = await AsyncStorage.getItem('usuario');
      if (json) setUsuario(JSON.parse(json));
    };
    obtenerUsuario();
  }, []);

  const registrarEvento = async (tipo) => {
    if (!usuario) {
      Alert.alert('Error', 'Usuario no identificado');
      return;
    }

    const coleccion = tipo === 'entrada' ? 'Entrada' : 'Salida';
    try {
      await addDoc(collection(db, coleccion), {
        fecha_hora: Timestamp.now(),
        id_usuario: usuario.id,
        tipo_usuario: usuario.tipo
      });
      console.log(`✅ ${coleccion} registrada`);
    } catch (error) {
      console.error(`❌ Error al registrar ${coleccion}:`, error);
      Alert.alert('Error', `No se pudo registrar la ${coleccion}`);
    }
  };

  const manejarEstado = (nuevoEstado) => {
    setEstado(nuevoEstado);
    if (nuevoEstado === 'entrada') registrarEvento('entrada');
    if (nuevoEstado === 'salida') registrarEvento('salida');
  };

  const obtenerContenido = () => {
    switch (estado) {
      case 'entrada':
        return {
          icono: 'car-parking-lights',
          color: '#4CAF50',
          mensaje: '¡Entrada registrada!',
          animacion: 'bounceIn'
        };
      case 'salida':
        return {
          icono: 'exit-run',
          color: '#2196F3',
          mensaje: '¡Salida registrada!',
          animacion: 'fadeInUp'
        };
      case 'denegado':
        return {
          icono: 'garage-alert',
          color: '#FFC107',
          mensaje: 'No hay cajones disponibles.',
          animacion: 'fadeIn'
        };
      case 'error':
        return {
          icono: 'alert-octagon',
          color: '#F44336',
          mensaje: 'Ocurrió un error.',
          animacion: 'shake'
        };
      default:
        return null;
    }
  };

  const contenido = obtenerContenido();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Acceso</Text>

      <View style={styles.botones}>
        <Button mode="outlined" onPress={() => manejarEstado('entrada')} textColor="#1565C0">
          Simular Entrada
        </Button>
        <Button mode="outlined" onPress={() => manejarEstado('salida')} textColor="#1565C0">
          Simular Salida
        </Button>
        <Button mode="outlined" onPress={() => manejarEstado('denegado')} textColor="#1565C0">
          Simular Denegado
        </Button>
        <Button mode="outlined" onPress={() => manejarEstado('error')} textColor="#1565C0">
          Simular Error
        </Button>
      </View>

      {contenido && (
        <Animatable.View animation={contenido.animacion} duration={1000} style={styles.card}>
          <Icon name={contenido.icono} size={80} color={contenido.color} />
          <Text style={[styles.mensaje, { color: contenido.color }]}>{contenido.mensaje}</Text>
        </Animatable.View>
      )}

      <Button
        mode="contained-tonal"
        onPress={() => navigation.navigate('Dashboard')}
        style={{ marginTop: 30 }}
        buttonColor="#E3F2FD"
        textColor="#0D47A1"
      >
        Volver al Dashboard
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#E3F2FD'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0D47A1'
  },
  botones: {
    flexDirection: 'column',
    gap: 10,
    width: '100%',
    marginBottom: 30
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    elevation: 4
  },
  mensaje: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    textAlign: 'center'
  }
});
