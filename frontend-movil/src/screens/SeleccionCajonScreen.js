// src/screens/SeleccionCajonScreen.js

import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Text, Title } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE = 'https://ezaccess-backend.onrender.com/api';

export default function SeleccionCajonScreen() {
  const [cajones, setCajones] = useState([]);
  const [usuarioId, setUsuarioId] = useState(null);

  useEffect(() => {
    obtenerUsuario();
  }, []);

  useEffect(() => {
    if (usuarioId) {
      obtenerCajones();
    }
  }, [usuarioId]);

  const obtenerUsuario = async () => {
    const id = await AsyncStorage.getItem('user_id');
    setUsuarioId(id);
  };

  const obtenerCajones = async () => {
    try {
      const response = await axios.get(`${API_BASE}/cajones`);
      const libres = response.data.filter(c => c.estado === 'libre');
      setCajones(libres);
    } catch (error) {
      console.error('Error al obtener cajones:', error);
      Alert.alert('Error', 'No se pudieron cargar los cajones');
    }
  };

  const seleccionarCajon = async (id_caj) => {
    try {
      const nuevaAsignacion = {
        id_usu: usuarioId,
        id_caj: id_caj,
        tipo_asig: 'manual',
        estado_asig: 'activa'
      };

      const res = await axios.post(`${API_BASE}/asignaciones`, nuevaAsignacion);

      Alert.alert('Asignación exitosa', 'El cajón fue asignado correctamente');
    } catch (error) {
      console.error('Error al asignar cajón:', error);
      Alert.alert('Error', 'No se pudo asignar el cajón');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.cajon} onPress={() => seleccionarCajon(item.id_caj)}>
      <Text style={styles.numero}>Cajón {item.numero_caj}</Text>
      <Text style={styles.ubicacion}>{item.ubicacion_caj}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Title style={styles.titulo}>Selecciona un cajón disponible</Title>
      <FlatList
        data={cajones}
        keyExtractor={(item) => item.id_caj.toString()}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.lista}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  titulo: {
    textAlign: 'center',
    fontSize: 22,
    marginBottom: 16,
    color: '#0D47A1',
  },
  lista: {
    justifyContent: 'center',
  },
  cajon: {
    backgroundColor: '#C8E6C9',
    padding: 18,
    margin: 10,
    borderRadius: 12,
    width: '45%',
    alignItems: 'center',
    elevation: 2,
  },
  numero: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  ubicacion: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
});
