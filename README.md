# EZACCESS - Sistema de Acceso Vehicular Inteligente

Este proyecto es un sistema de acceso vehicular inteligente para residencias, empresas o escuelas. Permite gestionar el acceso de residentes y visitantes mediante credenciales NFC, sensores IoT y apps móvil y web.

## 📦 Tecnologías utilizadas

- **Frontend Web**: React + Bootstrap
- **Frontend Móvil**: React Native + Expo + React Native Paper
- **Backend**: Node.js + Express + Sequelize
- **Base de datos**: MySQL
- **IoT**: ESP32 con lector NFC, actuadores, sensores de proximidad

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

© Proyecto desarrollado por el equipo de Integradora 2 - UTEQ 2025
