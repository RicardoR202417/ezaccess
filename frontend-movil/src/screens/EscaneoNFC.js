import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, Title } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

// IP LOCAL de tu backend
const API_BASE = 'http://192.168.100.35:3000/api';

export default function EscaneoNFC() {
  const [modo, setModo] = useState(null);
  const [cargando, setCargando] = useState(false);
  const navigation = useNavigation();

  const simularEscaneoNFC = async () => {
    setCargando(true);
    setModo(null);

    const UID = 'NFC-MONITOR-003'; // ✅ UID válido de Diego

    try {
      const res = await fetch(`${API_BASE}/validar-uid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: UID })
      });

      const data = await res.json();
      console.log('✅ Respuesta del backend:', data); // 👈 Agregado para debug
      setCargando(false);

      if (data.permitido) {
        setModo(data.tipo); // 'entrada' o 'salida'

        setTimeout(() => {
          navigation.replace('EstadoAcceso', {
            estado: 'permitido',
            mensaje: `Acceso ${data.tipo}`,
            tipo: data.tipo
          });
        }, 2000);
      } else {
        navigation.replace('EstadoAcceso', {
          estado: 'denegado',
          mensaje: 'UID no válido',
          tipo: 'error'
        });
      }
    } catch (error) {
      console.error('❌ Error al enviar UID:', error);
      setCargando(false);
      navigation.replace('EstadoAcceso', {
        estado: 'denegado',
        mensaje: 'Error de red o servidor',
        tipo: 'error'
      });
    }
  };

  const datos = modo === 'entrada'
    ? { icono: 'login', mensaje: 'Entrada registrada', color: '#64B5F6' }
    : modo === 'salida'
    ? { icono: 'logout', mensaje: 'Salida registrada', color: '#4CAF50' }
    : null;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={simularEscaneoNFC} disabled={cargando}>
        <Animatable.View animation="pulse" iterationCount="infinite" duration={1500}>
          <View style={styles.iconCircle}>
            <Icon name="nfc" size={60} color="#1565C0" />
          </View>
        </Animatable.View>
      </TouchableOpacity>

      <Title style={styles.title}>Escaneo NFC</Title>
      <Text style={styles.subtitle}>Toca el ícono para simular escaneo</Text>

      {cargando && <ActivityIndicator size="large" color="#1565C0" style={{ marginTop: 20 }} />}

      {datos && (
        <Animatable.View animation="fadeInUp" duration={800} style={styles.resultado}>
          <Icon name={datos.icono} size={60} color={datos.color} />
          <Text style={[styles.mensaje, { color: datos.color }]}>{datos.mensaje}</Text>
        </Animatable.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#E3F2FD'
  },
  iconCircle: {
    width: 120,
    aspectRatio: 1,
    borderRadius: 60,
    backgroundColor: '#BBDEFB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6
  },
  title: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D47A1'
  },
  subtitle: {
    color: '#1565C0',
    marginBottom: 20
  },
  resultado: {
    marginTop: 30,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    width: '100%'
  },
  mensaje: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center'
  }
});
