import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Title, RadioButton } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SolicitudVisitante({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [motivo, setMotivo] = useState('');
  const [modoEntrada, setModoEntrada] = useState('peaton');
  const [tipoVehiculo, setTipoVehiculo] = useState('');
  const [placas, setPlacas] = useState('');
  const [fechaVisita, setFechaVisita] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleEnviar = async () => {
    if (!nombre.trim() || !motivo.trim() || !fechaVisita.trim()) {
      setMensaje('Por favor llena todos los campos obligatorios.');
      return;
    }
    if (modoEntrada === 'vehiculo' && (!tipoVehiculo.trim() || !placas.trim())) {
      setMensaje('Completa los campos del vehículo.');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setMensaje('Token no encontrado. Inicia sesión de nuevo.');
        return;
      }
      const response = await fetch('https://ezaccess-backend.onrender.com/api/solicitudes-visita', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre_sol: nombre,
          motivo_sol: motivo,
          tipo_ingreso_sol: modoEntrada,
          modelo_veh_sol: modoEntrada === 'vehiculo' ? tipoVehiculo : null,
          placas_veh_sol: modoEntrada === 'vehiculo' ? placas : null,
          fecha_visita_sol: fechaVisita
        })
      });
      const data = await response.json();
      if (response.ok) {
        setMensaje(`✅ ${data.mensaje}`);
        setNombre('');
        setMotivo('');
        setModoEntrada('peaton');
        setTipoVehiculo('');
        setPlacas('');
        setFechaVisita('');
      } else {
        setMensaje(`❌ Error: ${data.mensaje || 'No se pudo registrar la solicitud'}`);
      }
    } catch (error) {
      console.error('Error al enviar solicitud:', error);
      setMensaje('❌ Error al conectar con el servidor');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Animatable.View animation="fadeInUp" duration={1000} style={styles.card}>
          <Title style={styles.title}>Solicitud de Acceso</Title>

          <TextInput
            label="Nombre del visitante"
            mode="outlined"
            value={nombre}
            onChangeText={setNombre}
            style={styles.input}
            outlineColor="#1565C0"
            activeOutlineColor="#0D47A1"
          />

          <TextInput
            label="Motivo de visita"
            mode="outlined"
            value={motivo}
            onChangeText={setMotivo}
            style={styles.input}
            outlineColor="#1565C0"
            activeOutlineColor="#0D47A1"
          />

          <TextInput
            label="Fecha de visita (YYYY-MM-DD)"
            mode="outlined"
            value={fechaVisita}
            onChangeText={setFechaVisita}
            style={styles.input}
            outlineColor="#1565C0"
            activeOutlineColor="#0D47A1"
            placeholder="Ej. 2025-08-04"
          />

          <Text style={styles.label}>¿Cómo ingresa el visitante?</Text>
          <RadioButton.Group onValueChange={setModoEntrada} value={modoEntrada}>
            <View style={styles.radioRow}>
              <RadioButton value="peaton" />
              <Text>Peatón</Text>
            </View>
            <View style={styles.radioRow}>
              <RadioButton value="vehiculo" />
              <Text>Vehículo</Text>
            </View>
          </RadioButton.Group>

          {modoEntrada === 'vehiculo' && (
            <>
              <TextInput
                label="Modelo"
                mode="outlined"
                value={tipoVehiculo}
                onChangeText={setTipoVehiculo}
                style={styles.input}
                outlineColor="#1565C0"
                activeOutlineColor="#0D47A1"
              />

              <TextInput
                label="Placas"
                mode="outlined"
                value={placas}
                onChangeText={setPlacas}
                style={styles.input}
                outlineColor="#1565C0"
                activeOutlineColor="#0D47A1"
              />
            </>
          )}

          <Button
            mode="contained"
            onPress={handleEnviar}
            style={styles.button}
            contentStyle={{ paddingVertical: 6 }}
            buttonColor="#1565C0"
          >
            Enviar Solicitud
          </Button>

          {mensaje !== '' && (
            <Text style={styles.mensaje}>{mensaje}</Text>
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    elevation: 5,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    color: '#0D47A1',
    marginBottom: 10,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    borderRadius: 8,
  },
  mensaje: {
    marginTop: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#1565C0',
  },
  volverBtn: {
    marginTop: 20,
    borderRadius: 10,
    borderColor: '#1565C0',
    borderWidth: 1,
  },
  label: {
    fontSize: 16,
    color: '#0D47A1',
    marginBottom: 5,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
});
