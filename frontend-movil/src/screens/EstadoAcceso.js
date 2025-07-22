// src/screens/EstadoAcceso.js

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function EstadoAcceso({ navigation, route }) {
  const { estado, mensaje, tipo, cajon } = route.params;

  const accesoPermitido = estado === 'permitido';
  const icono = accesoPermitido ? (tipo === 'entrada' ? 'login' : 'logout') : 'close-circle';
  const color = accesoPermitido ? (tipo === 'entrada' ? '#64B5F6' : '#4CAF50') : '#F44336';

  return (
    <View style={styles.container}>
      <Animatable.View
        animation={accesoPermitido ? 'bounceIn' : 'shake'}
        duration={1200}
        style={styles.card}
      >
        <Icon name={icono} size={100} color={color} />

        <Text style={[styles.texto, { color }]}>{mensaje}</Text>

        {accesoPermitido && tipo === 'entrada' && cajon && (
          <View style={styles.cajonInfo}>
            <Text style={styles.label}>Cajón asignado:</Text>
            <Text style={styles.valor}>Número: {cajon.numero}</Text>
            <Text style={styles.valor}>Ubicación: {cajon.ubicacion}</Text>
          </View>
        )}

        <Button
          mode="outlined"
          onPress={() => navigation.navigate('Dashboard')}
          style={styles.volverBtn}
          textColor="#1565C0"
        >
          Volver al Dashboard
        </Button>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E3F2FD'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    elevation: 4,
    width: '80%'
  },
  texto: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center'
  },
  cajonInfo: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    padding: 10
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0D47A1',
    marginBottom: 4
  },
  valor: {
    fontSize: 16,
    color: '#333'
  },
  volverBtn: {
    width: '100%',
    marginTop: 25,
    borderColor: '#1565C0',
    borderWidth: 1
  }
});
