import React, { useState, useContext, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';
import { Button } from 'react-native-paper';

export default function HistorialVisitas({ navigation }) {
  const { usuario } = useContext(AuthContext);
  const [visitas, setVisitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('👤 Usuario en contexto:', usuario);

    if (!usuario?.token) {
      setLoading(false);
      return;
    }

    const obtenerVisitas = async () => {
      try {
        const res = await fetch(`${API_URL}/solicitudes/usuario`, {
          headers: {
            Authorization: `Bearer ${usuario.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        console.log('🔎 Respuesta del backend:', data);

        if (data?.solicitudes && Array.isArray(data.solicitudes)) {
          setVisitas(data.solicitudes);
        } else {
          setVisitas([]);
        }
      } catch (error) {
        console.error("🚫 Error al obtener visitas:", error);
        setVisitas([]);
      } finally {
        setLoading(false);
      }
    };

    obtenerVisitas();
  }, [usuario?.token]);

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

  if (!usuario?.token) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Historial de Visitas</Text>
        <Text style={{ textAlign: 'center', marginTop: 20, color: 'red' }}>
          Usuario no autenticado. Inicia sesión para ver tu historial.
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Login')}
          style={styles.volverButton}
        >
          Ir al Login
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Historial de Visitas</Text>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Dashboard')}
        style={styles.volverButton}
      >
        Volver al Dashboard
      </Button>
      {/* Encabezados de la tabla */}
      <View style={[styles.row, styles.headerRow]}>
        <Text style={[styles.cell, styles.headerCell, { flex: 2 }]}>Nombre</Text>
        <Text style={[styles.cell, styles.headerCell, { flex: 2 }]}>Motivo</Text>
        <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>Estado</Text>
        <Text style={[styles.cell, styles.headerCell, { flex: 2 }]}>Fecha</Text>
        <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>Ingreso</Text>
      </View>
      {loading ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Cargando visitas...</Text>
      ) : (
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
      )}
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
  volverButton: {
    backgroundColor: '#1565C0',
    marginBottom: 20,
  },
});