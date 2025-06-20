import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Title, Button, Text } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Dashboard({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Animatable.View animation="fadeInDown" duration={800} style={styles.card}>
        <Title style={styles.title}>¡Bienvenido a EZACCESS!</Title>
        <Text style={styles.subtitle}>Selecciona una opción:</Text>

        <View style={styles.buttons}>
          {/* 🔹 Botón fusionado */}
          <Button
            mode="outlined"
            icon={() => <Icon name="garage" size={20} color="#1565C0" />}
            onPress={() => navigation.navigate('EstadoAcceso')}
            style={styles.button}
            labelStyle={styles.buttonText}
          >
            Revisar Estado y Cajón
          </Button>

          {/* 🔹 Botón solicitud visitante */}
          <Button
            mode="outlined"
            icon={() => <Icon name="account-plus" size={20} color="#1565C0" />}
            onPress={() => navigation.navigate('SolicitudVisitante')}
            style={styles.button}
            labelStyle={styles.buttonText}
          >
            Solicitar Visitante
          </Button>

          {/* 🔹 Botón escaneo NFC (si deseas dejarlo disponible desde aquí también) */}
          <Button
            mode="outlined"
            icon={() => <Icon name="nfc" size={20} color="#1565C0" />}
            onPress={() => navigation.navigate('EscaneoNFC')}
            style={styles.button}
            labelStyle={styles.buttonText}
          >
            Escanear NFC
          </Button>
        </View>

        <Button
          mode="contained"
          icon="logout"
          onPress={() => navigation.replace('Login')}
          style={styles.logoutButton}
          contentStyle={{ paddingVertical: 6 }}
        >
          Cerrar Sesión
        </Button>
      </Animatable.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    fontSize: 26,
    marginBottom: 8,
    color: '#0D47A1',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
    color: '#555',
  },
  buttons: {
    gap: 10,
  },
  button: {
    borderColor: '#1565C0',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#1565C0',
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#1565C0',
    borderRadius: 10,
  },
});
