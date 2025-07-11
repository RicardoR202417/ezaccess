# EZACCESS - Sistema de Acceso Vehicular Inteligente

Este proyecto es un sistema de acceso vehicular inteligente para residencias, empresas o escuelas. Permite gestionar el acceso de residentes y visitantes mediante credenciales NFC, sensores IoT y apps móvil y web.

## 📦 Tecnologías utilizadas

- **Frontend Web**: React + Bootstrap
- **Frontend Móvil**: React Native + Expo + React Native Paper
- **Backend**: Node.js + Express + Sequelize
- **Base de datos**: PostgreSQL y Firebase.
- **IoT**: ESP32 con lector NFC, actuadores, sensores de proximidad


## Como acceder a la base de datos

1.- Tener PostgreSQL instalado

2.- Tener las variables de entorno configuradas en el path general del sistema

3.- Entrar a tu cmd

4.- Es importante tener el archivo de la base de datos en tu computadora (esta en el rive del proyecto) 

5.- Comando para conectarse a la base de datos en la nube 
psql -h dpg-d1mhp6a4d50c73e3kjhg-a.virginia-postgres.render.com -U root -d ezaccess -p 5432

6.- Contraseña 8l3wTr63IEwEYL7eRBCJwo6W5BiiwTkg copiar y hacer click en click derecho 

7.- Comando para importar el archivo de la base de datos 
psql -U postgres -d mi_db -h localhost -p 5432 -f "ruta"






## 📁 Estructura del proyecto

```
├── backend/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── server.js
├── frontend-web/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── styles/
│   │   ├── App.jsx
├── frontend-movil/
│   ├── assets/
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── config.js
```

## 🚀 Cómo ejecutar el proyecto

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/ezaccess.git
```

### 2. Backend (Node.js)
```bash
cd backend
npm install
nodemon server.js
```

> Asegúrate de tener MySQL corriendo y haber creado la base de datos `ezaccess`. También configura `.env` con JWT y conexión a la BD.

### 3. Frontend Web
```bash
cd frontend-web
npm install
npm run dev
```

> Se abrirá en http://localhost:5173

### 4. Frontend Móvil (Expo)
```bash
cd frontend-movil
npm install
npx expo start
```

> Escanea el QR con Expo Go. Asegúrate de que `API_URL` en `config.js` esté configurado con la IP local de tu PC:
```js
export const API_URL = 'http://192.168.X.X:3000/api';
```

## 🛠️ Funcionalidades implementadas

- Login y logout para residentes (app móvil) y monitores (app web)
- Registro de nuevos usuarios desde el panel del monitor
- Gestión de usuarios (CRUD web)
- Validación de sesión protegida por token (JWT)
- Diseño profesional con estilos reutilizables

## 📎 Notas importantes

- Los estilos globales están centralizados en `frontend-web/src/styles/`
- Se utiliza `localStorage` para mantener sesión activa y proteger rutas
- El backend debe estar corriendo en todo momento para ambas apps
- Asegúrate de tener conectividad entre tu dispositivo móvil y la IP local del backend

## 🔐 Protección de rutas

- Las vistas protegidas en la web requieren token JWT
- La app móvil rechaza accesos si no hay sesión válida

## ✅ Recomendaciones

- Utiliza `ThunderClient` o `Postman` para probar el login y registro
- Para pruebas móviles, desactiva firewall si no permite conexión al puerto 3000
- Siempre revisar la terminal del backend ante errores 500

---



## Dominios

-Frontened Web 
https://ezaccess.onrender.com/

-Backend
https://ezaccess-backend.onrender.com/



© Proyecto desarrollado por el equipo de Integradora 2 - UTEQ 2025
