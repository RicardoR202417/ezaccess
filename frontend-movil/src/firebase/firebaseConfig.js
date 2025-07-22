// src/firebase/firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuración de Firebase para EZACCESS
const firebaseConfig = {
  apiKey: "AIzaSyDMcFtt1sT9a4IGlCMzk-zDalByH41Wj24",
  authDomain: "ezaccess-98540.firebaseapp.com",
  projectId: "ezaccess-98540",
  storageBucket: "ezaccess-98540.firebasestorage.app",
  messagingSenderId: "269042249238",
  appId: "1:269042249238:web:2e5b13537724115662cf37"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener instancia de Firestore
const db = getFirestore(app);

export { db };
