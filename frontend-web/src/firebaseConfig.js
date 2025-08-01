// src/firebaseConfig.js
import { initializeApp } from "firebase/app";

// Configuración de Firebase de tu proyecto
const firebaseConfig = {
  apiKey: "AIzaSyDMcFtt1sT9a4IGlCMzk-zDalByH41Wj24",
  authDomain: "ezaccess-98540.firebaseapp.com",
  projectId: "ezaccess-98540",
  storageBucket: "ezaccess-98540.firebasestorage.app",
  messagingSenderId: "269042249238",
  appId: "1:269042249238:web:2e5b13537724115662cf37",
  measurementId: "G-TMKTYB58DS",
};

// Inicializa Firebase una sola vez
const app = initializeApp(firebaseConfig);

// Exporta la instancia de Firebase para usar en otras partes
export { app };
