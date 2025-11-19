# Backend - Sistema de Gestión de Reservas

API REST desarrollada con **Spring Boot** para la gestión de reservas de senderos en un parque natural.

## 🚀 Inicio Rápido

### Prerrequisitos

- **Java 17+**
- **Maven 3.6+**
- **Oracle Database** (o base de datos compatible)

### Configuración

1. Configura la base de datos en `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:oracle:thin:@localhost:1521/xepdb1
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña
```

2. Ejecuta el script SQL para crear las tablas:
```bash
sqlplus usuario/password @scripts/script.sql
```

3. Inicia el servidor:
```bash
mvn spring-boot:run
```

El servidor estará disponible en: `http://localhost:8081/api`

## 📚 Documentación

- **Swagger UI**: `http://localhost:8081/api/swagger-ui.html`
- **API Docs**: `http://localhost:8081/api/api-docs`

## 🏗️ Estructura del Proyecto

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/uptc/bases2/demo/
│   │   │   ├── config/          # Configuraciones (CORS, OpenAPI)
│   │   │   ├── controllers/     # Controladores REST
│   │   │   ├── models/          # Entidades JPA
│   │   │   ├── repository/      # Repositorios JPA
│   │   │   └── services/        # Lógica de negocio
│   │   └── resources/
│   │       └── application.properties
│   └── test/                    # Tests
├── scripts/                     # Scripts SQL
└── pom.xml
```

## 🔌 Endpoints Principales

- **Senderos**: `/api/sendero/*`
- **Reservas**: `/api/reserva/*`
- **Visitantes**: `/api/visitante/*`
- **Guías**: `/api/guia/*`
- **Horarios**: `/api/horario/*`
- **Asignaciones**: `/api/asignacion/*`

## 🛠️ Comandos Útiles

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

## 🔧 Tecnologías

- **Spring Boot 3.x**
- **Spring Data JPA**
- **Oracle Database**
- **OpenAPI/Swagger**
- **Maven**

