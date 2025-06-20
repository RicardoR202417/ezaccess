import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function EstadoAcceso({ navigation }) {
  const [accesoPermitido, setAccesoPermitido] = useState(true); // simulado

  const icono = accesoPermitido ? 'check-circle' : 'close-circle';
  const color = accesoPermitido ? '#4CAF50' : '#F44336';
  const mensaje = accesoPermitido ? '¡Acceso Permitido!' : 'Acceso Denegado';
  const cajonAsignado = accesoPermitido ? 'Cajón asignado: #3' : null;

  return (
    <View style={styles.container}>
      <Animatable.View
        animation={accesoPermitido ? 'bounceIn' : 'shake'}
        duration={1200}
        style={styles.card}
      >
        <Icon name={icono} size={100} color={color} />
        
        <Text style={[styles.texto, { color }]}>{mensaje}</Text>

        {cajonAsignado && (
          <Text style={styles.cajon}>{cajonAsignado}</Text>
        )}

        <Button
          mode="contained-tonal"
          onPress={() => setAccesoPermitido(!accesoPermitido)}
          style={styles.toggleButton}
          buttonColor="#E3F2FD"
          textColor="#0D47A1"
        >
          Cambiar Estado (Prueba)
        </Button>

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
  cajon: {
    fontSize: 18,
    color: '#1565C0',
    fontWeight: '600',
    marginBottom: 20
  },
  toggleButton: {
    marginBottom: 15,
    width: '100%'
  },
  volverBtn: {
    width: '100%',
    borderRadius: 10,
    borderColor: '#1565C0',
    borderWidth: 1
  }
});
