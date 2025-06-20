import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importa todas las pantallas aquí arriba
import LoginScreen from '../screens/LoginScreen';
import Dashboard from '../screens/Dashboard';
import EstadoAcceso from '../screens/EstadoAcceso';
import AsignacionCajon from '../screens/AsignacionCajon';
import SolicitudVisitante from '../screens/SolicitudVisitante';
import EscaneoNFC from '../screens/EscaneoNFC';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="EstadoAcceso" component={EstadoAcceso} />
        <Stack.Screen name="AsignacionCajon" component={AsignacionCajon} />
        <Stack.Screen name="SolicitudVisitante" component={SolicitudVisitante} />
        <Stack.Screen name="EscaneoNFC" component={EscaneoNFC} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
