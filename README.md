# 🌲 Sistema de Gestión de Reservas - Parque Natural

Sistema completo de gestión de reservas para senderos de un parque natural, desarrollado con **Spring Boot** (Backend) y **React + TypeScript** (Frontend).

## 📁 Estructura del Proyecto

Este es un **monorepo** que contiene tanto el backend como el frontend:

```
ProyectoBases/
├── backend/          # API REST con Spring Boot
│   ├── src/
│   ├── pom.xml
│   └── scripts/
├── frontend/         # Aplicación React + TypeScript
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
└── README.md         # Este archivo
```

## 🚀 Inicio Rápido

### Prerrequisitos

- **Java 17+** (para el backend)
- **Node.js 18+** y **npm** (para el frontend)
- **Oracle Database** (o base de datos compatible)
- **Maven 3.6+** (para el backend)

### Backend (Spring Boot)

1. Navega al directorio del backend:
```bash
cd backend
```

2. Configura la base de datos en `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:oracle:thin:@localhost:1521/xepdb1
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña
```

3. Ejecuta el script SQL para crear las tablas:
```bash
# Ejecuta el script en tu base de datos Oracle
sqlplus usuario/password @scripts/script.sql
```

4. Inicia el servidor:
```bash
# Con Maven
mvn spring-boot:run

# O con el wrapper
./mvnw spring-boot:run
```

El backend estará disponible en: `http://localhost:8081/api`

**Endpoints principales:**
- API Base: `http://localhost:8081/api`
- Swagger UI: `http://localhost:8081/api/swagger-ui.html`
- API Docs: `http://localhost:8081/api/api-docs`

### Frontend (React + Vite)

1. Navega al directorio del frontend:
```bash
cd frontend
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura la URL del backend (opcional):
Crea un archivo `.env` en `frontend/`:
```env
VITE_API_BASE_URL=http://localhost:8081/api
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

## 📚 Documentación

### Backend

- **Swagger UI**: `http://localhost:8081/api/swagger-ui.html`
- **API Docs**: `http://localhost:8081/api/api-docs`

### Frontend

Ver `frontend/README.md` para más detalles sobre la estructura del frontend.

## 🏗️ Arquitectura

### Backend
- **Framework**: Spring Boot 3.x
- **Base de datos**: Oracle Database
- **ORM**: JPA/Hibernate
- **Documentación**: OpenAPI/Swagger
- **CORS**: Configurado para desarrollo local

### Frontend
- **Framework**: React 19
- **Lenguaje**: TypeScript
- **Build Tool**: Vite
- **Estilos**: Tailwind CSS
- **Estado**: React Query (TanStack Query)
- **Formularios**: React Hook Form + Zod
- **HTTP Client**: Axios

## 📦 Funcionalidades

### Gestión de Senderos
- ✅ Listar senderos disponibles
- ✅ Filtrar por dificultad, estado, guía requerido
- ✅ Ver detalles de cada sendero
- ✅ Consultar disponibilidad por fecha

### Gestión de Reservas
- ✅ Crear nuevas reservas
- ✅ Consultar reservas por ID
- ✅ Verificar disponibilidad en tiempo real
- ✅ Dashboard administrativo con estadísticas

### Gestión de Visitantes
- ✅ Búsqueda automática por cédula
- ✅ Creación/actualización de visitantes
- ✅ Validación de datos

## 🛠️ Scripts Útiles

### Backend
```bash
# Compilar
mvn clean compile

# Ejecutar tests
mvn test

# Generar JAR
mvn clean package

# Ejecutar aplicación
mvn spring-boot:run
```

### Frontend
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

## 🔧 Configuración

### Variables de Entorno

**Backend**: Configurado en `backend/src/main/resources/application.properties`

**Frontend**: Crear `.env` en `frontend/`:
```env
VITE_API_BASE_URL=http://localhost:8081/api
```

### CORS

El backend está configurado para aceptar peticiones desde:
- `http://localhost:3000`
- `http://localhost:5173`

Para agregar más orígenes, edita `backend/src/main/java/com/uptc/bases2/demo/config/CorsConfig.java`

## 📝 Base de Datos

El proyecto utiliza Oracle Database. El script de creación de tablas se encuentra en:
`backend/scripts/script.sql`

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es parte de un trabajo académico.

## 👥 Autores

- Desarrollado para el curso de Bases de Datos 2 - UPTC

## 🙏 Agradecimientos

- Spring Boot Team
- React Team
- Vite Team
- Tailwind CSS Team

---

**Nota**: Asegúrate de tener la base de datos configurada y corriendo antes de iniciar el backend.

