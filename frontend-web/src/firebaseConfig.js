// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

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

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Configura Firebase Auth y proveedor de Google
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Exporta todo lo necesario
export { app, auth, googleProvider };
