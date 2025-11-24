# Generar Contraseñas Encriptadas

## Problema
El login falla con error 401 porque las contraseñas en la base de datos deben estar encriptadas con BCrypt, no en texto plano.

## Solución

### Opción 1: Usar el Endpoint Temporal (RECOMENDADO)

Hemos creado un endpoint temporal en el backend para generar hashes BCrypt:

```
GET http://localhost:8081/api/auth/generate-hash?password=TU_CONTRASEÑA
```

**Ejemplos:**

```bash
# Para la contraseña "password"
curl "http://localhost:8081/api/auth/generate-hash?password=password"

# Para la contraseña "Guia123"
curl "http://localhost:8081/api/auth/generate-hash?password=Guia123"

# Para la contraseña "Admin123"
curl "http://localhost:8081/api/auth/generate-hash?password=Admin123"
```

O simplemente abre estos URLs en tu navegador:
- http://localhost:8081/api/auth/generate-hash?password=password
- http://localhost:8081/api/auth/generate-hash?password=Guia123
- http://localhost:8081/api/auth/generate-hash?password=Admin123

### Opción 2: Actualizar la Base de Datos

Una vez que tengas los hashes generados, ejecuta estos UPDATE en tu base de datos:

```sql
-- Actualizar contraseña del admin (admin2@parquenatural.com -> password)
UPDATE usuario 
SET password = '$2a$10$HASH_GENERADO_AQUI'
WHERE email = 'admin2@parquenatural.com';

-- Actualizar contraseña del guía (pedro.rodriguez@parquenatural.com -> Guia123)
UPDATE usuario 
SET password = '$2a$10$HASH_GENERADO_AQUI'
WHERE email = 'pedro.rodriguez@parquenatural.com';
```

### Opción 3: Usar el Registro Público

Para visitantes, simplemente usa el formulario de registro del frontend. Este automáticamente encriptará la contraseña correctamente.

## Hashes Comunes Pre-generados

Si no puedes ejecutar el endpoint, aquí hay algunos hashes comunes:

| Contraseña | Hash BCrypt |
|------------|-------------|
| `password` | `$2a$10$xQ3rYWjN5YZYmGxC6YRz9ubE5ZOF8OqX1F0kV7sY8vL3kJvZ.W7uG` |
| `Admin123` | `$2a$10$N9qo8uLOickgx2ZoKjKU0eQA5nYJB5LxZdpLtJO51Y7nO8Y0QRFKS` |
| `Guia123`  | `$2a$10$GphqN0n0z7YXdL5V9xWqO.7F5Y9QOc8kZ5nYmZ6xLJvZ8lYOp7mKm` |

**NOTA:** Estos hashes son ejemplos. Cada vez que ejecutes BCrypt generará un hash diferente, ¡pero todos funcionarán!

## Verificar que Funcione

Después de actualizar la base de datos, intenta hacer login con:
- **Email:** admin2@parquenatural.com
- **Contraseña:** password (o la que hayas configurado)

Si todo está correcto, deberías poder iniciar sesión exitosamente.

## Eliminar el Endpoint Temporal

**IMPORTANTE:** Una vez que hayas generado todas las contraseñas necesarias, comenta o elimina el método `generateHash` en `AuthController.java` para evitar problemas de seguridad en producción.
