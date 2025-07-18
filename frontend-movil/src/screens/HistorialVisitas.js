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
    <View style={styles.row}>
      <Text style={[styles.cell, { flex: 2 }]}>{item.nombre_sol}</Text>
      <Text style={[styles.cell, { flex: 2 }]}>{item.motivo_sol}</Text>
      <Text style={[styles.cell, { flex: 1 }]}>{item.estado_sol?.toUpperCase()}</Text>
      <Text style={[styles.cell, { flex: 2 }]}>{new Date(item.fecha_reg_sol).toLocaleString()}</Text>
      <Text style={[styles.cell, { flex: 1 }]}>{item.tipo_ingreso_sol || 'N/A'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Historial de Visitas</Text>
      {/* Encabezados de la tabla */}
      <View style={[styles.row, styles.headerRow]}>
        <Text style={[styles.cell, styles.headerCell, { flex: 2 }]}>Nombre</Text>
        <Text style={[styles.cell, styles.headerCell, { flex: 2 }]}>Motivo</Text>
        <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>Estado</Text>
        <Text style={[styles.cell, styles.headerCell, { flex: 2 }]}>Fecha</Text>
        <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>Ingreso</Text>
      </View>
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
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
    alignItems: 'center',
  },
  headerRow: {
    backgroundColor: '#e3e3e3',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cell: {
    fontSize: 13,
    paddingHorizontal: 4,
    textAlign: 'center',
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 14,
  },
});
