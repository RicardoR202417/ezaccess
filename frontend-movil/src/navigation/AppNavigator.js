import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AsignacionCajon from '../screens/AsignacionCajon';
import Dashboard from '../screens/Dashboard';
import EscaneoNFC from '../screens/EscaneoNFC';
import EstadoAcceso from '../screens/EstadoAcceso';
import HistorialVisitas from '../screens/HistorialVisitas';
import LoginScreen from '../screens/LoginScreen';
import SeleccionCajonScreen from '../screens/SeleccionCajonScreen';
import SolicitudVisitante from '../screens/SolicitudVisitante';

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
        <Stack.Screen name="HistorialVisitas" component={HistorialVisitas} />
        <Stack.Screen name="SeleccionCajon" component={SeleccionCajonScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
