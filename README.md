# 🕰️ Proyecto Web - Tienda de Relojes

Una aplicación web moderna para la valoración de relojes que incluye un catálogo de productos, sistema de autenticación, panel de administración y chat de soporte en tiempo real.

## 📋 Características

- **Catálogo de productos**: Navegación y visualización de relojes con filtros y búsqueda
- **Autenticación**: Sistema de registro/login con JWT
- **Panel de administración**: Gestión completa de productos (CRUD)
- **Chat de soporte**: Sistema de soporte técnico en tiempo real con Socket.IO
- **Internacionalización**: Soporte para español e inglés
- **Responsive Design**: Interfaz adaptativa con TailwindCSS

## 🛠️ Stack Tecnológico

### Frontend
- **React 19** con Vite
- **TailwindCSS** para estilos
- **React Router** para navegación
- **i18next** para internacionalización
- **Socket.IO Client** para chat en tiempo real

### Backend
- **Node.js** con Express
- **SQLite** como base de datos
- **Socket.IO** para comunicación en tiempo real
- **JWT** para autenticación
- **bcryptjs** para encriptación de contraseñas
- **Multer** para subida de archivos

## 📦 Requisitos Previos

- **Node.js** v18 o superior
- **npm** v8 o superior

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd proyectoWeb1
```

### 2. Instalar dependencias del backend
```bash
cd server
npm install
```

### 3. Instalar dependencias del frontend
```bash
cd ../frontend/vite-project
npm install
```

## ▶️ Ejecución del Proyecto

### Backend (Puerto 3000)
```bash
cd server
npm start
```

### Frontend (Puerto 5173)

```bash
cd frontend/vite-project
npm run dev
```

## 📊 Base de Datos

- **Tipo**: SQLite
- **Ubicación**: `/server/database.sqlite`
- **Tablas**: users, products, support_chats, chat_messages, product_reviews

La base de datos se crea automáticamente al iniciar el servidor por primera vez.

## 🔑 Credenciales de Prueba

- **Admin**: `victor@prueba.com` / `victor`
- **Cliente**: Registro libre disponible

## 🌐 URLs de Acceso

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **Chat WebSocket**: ws://localhost:3000/support

## 📁 Estructura del Proyecto

```
proyectoWeb1/
├── frontend/vite-project/     # Aplicación React
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   ├── css/              # Estilos CSS
│   │   ├── i18n/             # Archivos de traducción
│   │   └── hooks/            # Custom hooks
│   └── package.json
├── server/                   # API Backend
│   ├── routes/              # Rutas de la API
│   ├── middleware/          # Middlewares de autenticación
│   ├── socket/              # Manejadores de Socket.IO
│   ├── db.js               # Configuración de base de datos
│   └── package.json
└── README.md
```

## 👥 Equipo de Desarrollo

- **Víctor Vega Martínez**
- **Pablo Garay Pérez** 
- **Jesús Alfonso Marín Sánchez**
- **Alejandro Lillo Rodríguez**
- **Juan Cordero Pascual**