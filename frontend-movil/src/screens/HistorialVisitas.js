import React, { useState, useContext, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';
import { Button } from 'react-native-paper';

<<<<<<< HEAD
export default function HistorialVisitas({ navigation }) {
=======

export default function HistorialVisitas() {
>>>>>>> e33cf7afd1e990a887b60c0ed3e24cb815bd3a29
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
    <View style={styles.row}>
      <Text style={[styles.cell, { flex: 2 }]}>{item.nombre_sol}</Text>
      <Text style={[styles.cell, { flex: 2 }]}>{item.motivo_sol}</Text>
      <Text style={[styles.cell, { flex: 1 }]}>{item.estado_sol?.toUpperCase()}</Text>
      <Text style={[styles.cell, { flex: 2 }]}>{new Date(item.fecha_reg_sol).toLocaleString()}</Text>
      <Text style={[styles.cell, { flex: 1 }]}>{item.tipo_ingreso_sol || 'N/A'}</Text>
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
<<<<<<< HEAD
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Dashboard')}
        style={styles.volverButton}
      >
        Volver al Dashboard
      </Button>

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
=======
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
>>>>>>> e33cf7afd1e990a887b60c0ed3e24cb815bd3a29
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
  volverButton: {
    backgroundColor: '#1565C0',
    marginBottom: 20,
  },
});