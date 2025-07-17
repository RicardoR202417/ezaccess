import React, { useState, useContext, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';

export default function HistorialVisitas() {
  const { usuario } = useContext(AuthContext);
  const [visitas, setVisitas] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const obtenerVisitas = async () => {
        try {
          const res = await fetch(`${API_URL}/solicitudes/usuario`, {
            headers: {
              Authorization: `Bearer ${usuario?.token}`,
              'Content-Type': 'application/json',
            },
          });

          const text = await res.text();
          const data = JSON.parse(text);

          if (res.ok && data?.solicitudes) {
            setVisitas(data.solicitudes);
          }
        } catch (error) {
          console.error("Error al obtener visitas:", error);
        }
      };

      if (usuario?.token) {
        obtenerVisitas();
      }
    }, [usuario?.token])
  );

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.card,
        item.estado_sol === 'aceptada' ? styles.cardPermitido : styles.cardDenegado,
      ]}
    >
      <Text style={styles.estado}>{item.estado_sol?.toUpperCase()}</Text>
      <Text style={styles.fecha}>Fecha: {new Date(item.fecha_reg_sol).toLocaleString()}</Text>
      <Text style={styles.detalle}>Motivo: {item.motivo_sol || 'No especificado'}</Text>
      <Text style={styles.detalle}>Ingreso: {item.tipo_ingreso_sol || 'N/A'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Historial de Visitas</Text>
      <FlatList
        data={visitas}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            No hay visitas registradas.
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#0D47A1',
    textAlign: 'center',
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardPermitido: {
    backgroundColor: '#E8F5E9',
    borderLeftColor: '#388E3C',
    borderLeftWidth: 5,
  },
  cardDenegado: {
    backgroundColor: '#FFEBEE',
    borderLeftColor: '#D32F2F',
    borderLeftWidth: 5,
  },
  estado: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  fecha: {
    fontSize: 14,
    color: '#555',
  },
  detalle: {
    fontSize: 14,
    color: '#777',
  },
});
