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

## Consulta SQL 

/* 
====================================================
 README - CONSULTAS FUNCIONALES EZACCESS
====================================================

Este script contiene las vistas que actualmente
muestran información real en la base de datos EZACCESS.
Cada vista incluye:
  - Descripción funcional (para qué sirve)
  - Explicación técnica (cómo está hecha)
  - SELECT de prueba para comprobarla

Estas vistas sirven para generar reportes y alimentar
el frontend con datos listos para mostrar, evitando
hacer consultas complejas desde la aplicación.
*/

----------------------------------------------------
1️⃣ v_usuarios_activos
----------------------------------------------------
/*
📌 Funcionalidad:
Lista todos los usuarios que tienen acceso activo 
al sistema (estado_usu = 'activo').  
Incluye su nombre completo ya concatenado para 
mostrarlo directamente en reportes o tablas.

⚙️ Cómo funciona:
- Usa `CONCAT_WS(' ', ...)` para unir nombre y apellidos 
  en un solo campo llamado `nombre_completo`.
- Filtra por `estado_usu = 'activo'` para evitar mostrar 
  usuarios suspendidos o dados de baja.
- Ordena alfabéticamente para que sea más fácil buscar.

🎯 Uso práctico:
Esta vista la puede usar el monitor o el administrador 
para tener una lista rápida de todos los usuarios que 
pueden entrar actualmente.
*/
CREATE OR REPLACE VIEW v_usuarios_activos AS
SELECT 
    id_usu,
    CONCAT_WS(' ', nombre_usu, apellido_pat_usu, apellido_mat_usu) AS nombre_completo,
    correo_usu,
    tipo_usu,
    estado_usu
FROM usuarios
WHERE estado_usu = 'activo'
ORDER BY nombre_completo ASC;

-- Prueba:
SELECT * FROM v_usuarios_activos;


----------------------------------------------------
2️⃣ v_cajones_estado
----------------------------------------------------
/*
📌 Funcionalidad:
Muestra todos los cajones de estacionamiento con su 
número, ubicación y estado actual (por ejemplo: libre u ocupado).

⚙️ Cómo funciona:
- Consulta directamente la tabla `cajones`.
- Devuelve `estado_caj` que normalmente se actualiza 
  desde el backend o por sensores IoT.
- Ordena por número de cajón para una vista organizada.

🎯 Uso práctico:
En el dashboard del monitor se puede mostrar esta lista 
para ver rápidamente el estado de cada cajón.
*/
CREATE OR REPLACE VIEW v_cajones_estado AS
SELECT
    id_caj,
    numero_caj,
    ubicacion_caj,
    estado_caj
FROM cajones
ORDER BY numero_caj ASC;

-- Prueba:
SELECT * FROM v_cajones_estado;


----------------------------------------------------
4️⃣ v_historial_asignaciones
----------------------------------------------------
/*
📌 Funcionalidad:
Muestra todos los cambios realizados sobre la tabla 
`asignaciones` (crear, modificar, eliminar).

⚙️ Cómo funciona:
- La información proviene de la tabla `historial_asignaciones`, 
  que es llenada automáticamente por un TRIGGER (`trg_log_asignaciones`).
- Hace JOIN con `usuarios` y `asignaciones` para mostrar 
  el nombre del residente implicado.
- Ordena por `fecha_accion` para ver primero lo más reciente.

🎯 Uso práctico:
Sirve para auditorías y reportes, ya que muestra 
quién ocupó o liberó un cajón y cuándo.
*/
CREATE OR REPLACE VIEW v_historial_asignaciones AS
SELECT
    ha.id_hist,
    ha.id_asig,
    ha.accion,
    ha.fecha_accion,
    u.nombre_usu || ' ' || u.apellido_pat_usu AS residente
FROM historial_asignaciones ha
INNER JOIN asignaciones a ON a.id_asig = ha.id_asig
INNER JOIN usuarios u ON u.id_usu = a.id_usu
ORDER BY ha.fecha_accion DESC;

-- Prueba:
SELECT * FROM v_historial_asignaciones;


----------------------------------------------------
5️⃣ v_accesos
----------------------------------------------------
/*
📌 Funcionalidad:
Lista los registros de entrada y salida de todos los 
usuarios que han interactuado con el sistema.

⚙️ Cómo funciona:
- Consulta la tabla `accesos`.
- Muestra fecha y hora de entrada (`fecha_ent_acc`) 
  y de salida (`fecha_sal_acc`).
- Ordena de la más reciente a la más antigua.

🎯 Uso práctico:
En reportes se puede filtrar por fechas para saber 
quién estuvo en el estacionamiento y cuándo.
*/
CREATE OR REPLACE VIEW v_accesos AS
SELECT
    id_acc,
    id_usu,
    fecha_ent_acc,
    fecha_sal_acc
FROM accesos
ORDER BY fecha_ent_acc DESC;

-- Prueba:
SELECT * FROM v_accesos;


----------------------------------------------------
7️⃣ v_solicitudes_visitas
----------------------------------------------------
/*
📌 Funcionalidad:
Muestra las solicitudes de acceso para visitantes 
registradas en el sistema.

⚙️ Cómo funciona:
- Consulta la tabla `solicitudes_visitas`.
- Devuelve el nombre del visitante (`nombre_vis`), 
  fecha de visita y estado de la solicitud.
- Ordena de la más reciente a la más antigua.

🎯 Uso práctico:
Permite al monitor aprobar o rechazar solicitudes 
según la programación de visitas.
*/
CREATE OR REPLACE VIEW v_solicitudes_visitas AS
SELECT
    id_sol,
    id_usu,
    nombre_vis,
    fecha_vis,
    estado_sol
FROM solicitudes_visitas
ORDER BY fecha_vis DESC;

-- Prueba:
SELECT * FROM v_solicitudes_visitas;


----------------------------------------------------
🔟 v_top_residentes_30d
----------------------------------------------------
/*
📌 Funcionalidad:
Muestra los residentes con más entradas en los últimos 
30 días.

⚙️ Cómo funciona:
- Cuenta cuántos accesos (`COUNT(*)`) tiene cada usuario.
- Filtra por `tipo_usu = 'residente'` y `estado_usu = 'activo'`.
- Filtra accesos cuya `fecha_ent_acc` esté dentro del 
  último mes (`NOW() - INTERVAL '30 days'`).
- Agrupa por id y nombre para sumar las entradas.

🎯 Uso práctico:
Sirve para detectar residentes que usan mucho el 
estacionamiento o para premiar a los más frecuentes.
*/
CREATE OR REPLACE VIEW v_top_residentes_30d AS
SELECT
    u.id_usu,
    CONCAT_WS(' ', u.nombre_usu, u.apellido_pat_usu, u.apellido_mat_usu) AS nombre_completo,
    COUNT(*) AS total_entradas
FROM accesos a
INNER JOIN usuarios u ON u.id_usu = a.id_usu
WHERE a.fecha_ent_acc >= NOW() - INTERVAL '30 days'
  AND u.tipo_usu = 'residente'
  AND u.estado_usu = 'activo'
GROUP BY u.id_usu, nombre_completo
ORDER BY total_entradas DESC;

-- Prueba:
SELECT * FROM v_top_residentes_30d;




© Proyecto desarrollado por el equipo de Integradora 2 - UTEQ 2025
