import React, { useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert
} from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { API_URL } from '../config';
import { AuthContext } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!correo || !password) {
      Alert.alert('Campos vacíos', 'Por favor ingresa tu correo y contraseña.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena: password }) // o "password", según tu backend
      });

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      if (response.ok && data.token && data.usuario) {
        // Guarda el token en AsyncStorage para que esté disponible en toda la app
        await AsyncStorage.setItem('token', data.token);

        // Guarda usuario y token juntos en el contexto
        login({
          ...data.usuario,
          token: data.token
        });

        navigation.replace('Dashboard');
      } else {
        Alert.alert('Error', data.mensaje || 'Credenciales inválidas');
      }
    } catch (error) {
      console.error('Error en login:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Animatable.View animation="fadeInDown" duration={1000} style={styles.card}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
          />
          <Title style={styles.title}>EZACCESS</Title>
          <Text style={styles.subtitle}>Inicio de Sesión</Text>

          <TextInput
            label="Correo"
            mode="outlined"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            outlineColor="#1565C0"
            activeOutlineColor="#0D47A1"
          />

          <TextInput
            label="Contraseña"
            mode="outlined"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            outlineColor="#1565C0"
            activeOutlineColor="#0D47A1"
          />

          <Button
            mode="contained"
            buttonColor="#1565C0"
            onPress={handleLogin}
            style={styles.button}
            contentStyle={{ paddingVertical: 6 }}
          >
            <Text>Iniciar Sesión</Text>
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
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    elevation: 5,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    textAlign: 'center',
    fontSize: 28,
    marginBottom: 4,
    color: '#0D47A1',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 24,
    color: '#1565C0',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    borderRadius: 8,
    marginTop: 10,
  },
});