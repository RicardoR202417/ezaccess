# EZ ACCESS – Sistema Inteligente de Acceso Vehicular

## 🎯 Descripción General

**EZ ACCESS** es un sistema inteligente que automatiza y controla el acceso vehicular en entornos como residencias, escuelas y empresas. Integra una aplicación móvil para residentes, una plataforma web para el personal encargado, dispositivos IoT con tecnología NFC, sensores de proximidad y actuadores físicos, así como bases de datos SQL y NoSQL que permiten una operación eficiente, segura y en tiempo real.

---

## 🛠 Objetivo

Desarrollar un sistema inteligente de acceso vehicular que refuerce la seguridad, automatice la asignación de espacios y agilice el control de entrada y salida de vehículos en tiempo real.

---

## 📌 Alcance

- Aplicación móvil para residentes: acceso NFC, estado del acceso, solicitud de visitantes, consulta de cajón asignado y confirmación de salida.
- Plataforma web para monitores: gestión de usuarios, asignación de cajones, control de actuadores, generación de reportes e historial de actividad.
- Dispositivo IoT con lector NFC, actuador de bloqueo y sensores de proximidad para validar identidad y ocupación de cajones.
- Integración con:
  - Base de datos relacional (MySQL)
  - Base de datos no relacional (Redis o MongoDB)

---

## 👨‍💻 Tecnologías Utilizadas

- **Frontend Web:** React.js + Bootstrap
- **Frontend Móvil:** React Native + Expo
- **Backend:** Node.js + Express
- **IoT:** ESP32 con lector NFC y sensores
- **Bases de datos:**
  - MySQL (estructura principal)
  - Redis / MongoDB (procesos en tiempo real)

---

## 👥 Integrantes del Proyecto

- Ricardo Reséndiz González  
- Diego Jesús Reyes Rebolledo  
- Luis Daniel Zamora Ortiz  

**Grupo T232 – UTEQ**  
**División de Tecnologías de la Automatización e Información**  
**Materia: Integradora 2**

---

## 🗂 Estructura del Repositorio

```
ezaccess/
├── backend/
├── frontend-web/
├── frontend-movil/
├── iot/
├── database/
└── README.md
```

---

## 🔁 Flujo General del Sistema

1. El residente inicia sesión en su app móvil.
2. Al llegar, escanea su dispositivo NFC en el lector IoT.
3. El sistema valida el acceso en tiempo real con la base de datos.
4. Se le asigna un cajón de estacionamiento automáticamente.
5. El actuador desbloquea el cajón y el sensor de proximidad detecta si fue ocupado.
6. El monitor supervisa todo desde la app web.
7. El residente puede confirmar su salida y liberar el cajón.

---

## ✅ Requerimientos Funcionales Principales

### Aplicación Web (Monitor):
- Gestión de usuarios (alta, edición, baja lógica)
- Asignación automática o manual de cajones
- Control manual de actuadores
- Visualización en tiempo real del estado de los cajones
- Historial de accesos, asignaciones y cambios
- Generación de reportes estadísticos por usuario, uso, tiempo

### Aplicación Móvil (Residente):
- Inicio de sesión seguro
- Consulta de estado de acceso (permitido, denegado)
- Visualización del cajón asignado
- Identificación por NFC
- Solicitud de acceso para visitantes
- Confirmación de salida

---

## 🚀 Instrucciones Básicas para Ejecutar (opcional)

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend Web
```bash
cd frontend-web
npm install
npm start
```

### App Móvil
```bash
cd frontend-movil
npx expo start
```

> ⚠️ Asegúrate de tener configuradas las variables de entorno y la base de datos previamente antes de ejecutar cualquier componente.

---

## 📄 Licencia

Este proyecto fue desarrollado como parte de la materia **Integradora 2** de la **Universidad Tecnológica de Querétaro (UTEQ)**. Su uso está destinado exclusivamente con fines académicos.

---

## 🌐 Enlace de acceso (en desarrollo)

> http://www.ezaccess.com

---

¡Gracias por revisar nuestro proyecto!
