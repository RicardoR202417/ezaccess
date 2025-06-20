import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function AsignacionCajon({ navigation }) {
  const [estado, setEstado] = useState(null); // 'conformado' | 'denegado' | 'error'

  const obtenerContenido = () => {
    switch (estado) {
      case 'conformado':
        return {
          icono: 'car-parking-lights',
          color: '#4CAF50',
          mensaje: '¡Cajón asignado correctamente!',
          animacion: 'bounceIn'
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
          mensaje: 'Ocurrió un error al asignar el cajón.',
          animacion: 'shake'
        };
      default:
        return null;
    }
  };

  const contenido = obtenerContenido();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resultado de Asignación</Text>

      <View style={styles.botones}>
        <Button mode="outlined" onPress={() => setEstado('conformado')} textColor="#1565C0">
          Simular Conformado
        </Button>
        <Button mode="outlined" onPress={() => setEstado('denegado')} textColor="#1565C0">
          Simular Denegado
        </Button>
        <Button mode="outlined" onPress={() => setEstado('error')} textColor="#1565C0">
          Simular Error
        </Button>
      </View>

      {contenido && (
        <Animatable.View animation={contenido.animacion} duration={1000} style={[styles.card]}>
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
