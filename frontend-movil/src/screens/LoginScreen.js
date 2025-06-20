import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';

export default function LoginScreen({ navigation }) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    navigation.replace('EscaneoNFC'); // flujo actualizado
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
            Iniciar Sesión
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
