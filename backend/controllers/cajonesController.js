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
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const id = await AsyncStorage.getItem('user_id');
        if (id) {
          setUsuarioId(parseInt(id));
        } else {
          Alert.alert('Error', 'No se encontró el ID de usuario en sesión');
        }
      } catch (e) {
        console.error('Error leyendo AsyncStorage:', e);
      }
    };
    obtenerUsuario();
  }, []);

  useEffect(() => {
    if (usuarioId) {
      obtenerCajones();
    }
  }, [usuarioId]);

  const obtenerCajones = async () => {
    try {
      setCargando(true);
      const response = await axios.get(`${API_BASE}/cajones/estado`);
      const libres = response.data.filter(c => c.estado === 'libre');
      setCajones(libres);
    } catch (error) {
      console.error('❌ Error al obtener cajones:', error);
      Alert.alert('Error', 'No se pudieron cargar los cajones disponibles');
    } finally {
      setCargando(false);
    }
  };

  const seleccionarCajon = async (id_caj) => {
    if (!usuarioId) {
      return Alert.alert('Error', 'ID de usuario no disponible');
    }

    try {
      const res = await axios.put(`${API_BASE}/cajones/${id_caj}/estado`, {
        accion: 'activar',
        id_usu: usuarioId // si decides recibirlo por body
      });

      if (res.status === 200) {
        Alert.alert('✅ Cajón asignado', 'Se asignó correctamente el cajón.');
        obtenerCajones();
      } else {
        throw new Error('Respuesta inesperada');
      }
    } catch (error) {
      console.error('❌ Error al asignar cajón:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.mensaje || 'No se pudo asignar el cajón');
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

      {cajones.length === 0 && !cargando ? (
        <Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>
          No hay cajones disponibles actualmente
        </Text>
      ) : (
        <FlatList
          data={cajones}
          keyExtractor={(item) => item.id_caj.toString()}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.lista}
        />
      )}
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
    backgroundColor: '#AED581',
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
    color: '#1B5E20'
  },
  ubicacion: {
    fontSize: 14,
    color: '#33691E',
    marginTop: 4,
  },
});
