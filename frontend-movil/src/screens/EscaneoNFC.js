import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Title } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function EscaneoNFC({ navigation }) {
  const [modo, setModo] = useState(null); // 'entrada' | 'salida'

  const simularEntrada = () => {
    setModo('entrada');
    setTimeout(() => {
      navigation.replace('EstadoAcceso');
    }, 2000); // Simula el proceso de escaneo
  };

  const datos = modo === 'entrada'
    ? {
        icono: 'login',
        mensaje: 'Entrada registrada con éxito',
        color: '#64B5F6',
      }
    : null;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={simularEntrada}>
        <Animatable.View animation="pulse" iterationCount="infinite" duration={1500}>
          <View style={styles.iconCircle}>
            <Icon name="nfc" size={60} color="#1565C0" />
          </View>
        </Animatable.View>
      </TouchableOpacity>

      <Title style={styles.title}>Escaneo NFC</Title>
      <Text style={styles.subtitle}>Toca el ícono para simular escaneo</Text>

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
