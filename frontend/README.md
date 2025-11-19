# Frontend - Sistema de Gestión de Reservas

Aplicación web desarrollada con **React + TypeScript + Vite** para la gestión de reservas de senderos.

## 🚀 Inicio Rápido

### Prerrequisitos

- **Node.js 18+**
- **npm** o **yarn**

### Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Configura la URL del backend (opcional):
Crea un archivo `.env`:
```env
VITE_API_BASE_URL=http://localhost:8081/api
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

## 📚 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview de producción
npm run preview

# Linting
npm run lint
```

## 🏗️ Estructura del Proyecto

```
frontend/
├── src/
│   ├── api/              # Clientes API (Axios)
│   ├── components/       # Componentes React
│   │   ├── common/       # Componentes reutilizables
│   │   ├── features/     # Componentes por funcionalidad
│   │   └── layout/       # Componentes de layout
│   ├── contexts/         # Context API (Toast, etc.)
│   ├── hooks/            # Custom hooks
│   ├── pages/            # Páginas/Views
│   ├── types/            # Tipos TypeScript
│   └── utils/            # Utilidades
├── public/               # Archivos estáticos
└── package.json
```

## 🎨 Tecnologías

- **React 19**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **React Query** (TanStack Query)
- **React Hook Form + Zod**
- **Axios**
- **React Router**

## 📦 Funcionalidades

- ✅ Listado y filtrado de senderos
- ✅ Creación de reservas
- ✅ Consulta de reservas
- ✅ Dashboard administrativo
- ✅ Sistema de notificaciones
- ✅ Diseño responsive

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del frontend:

```env
VITE_API_BASE_URL=http://localhost:8081/api
```
