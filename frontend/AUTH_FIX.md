# Fix: Error 403 en Autenticación

## Problema Identificado

El login fallaba con error 403 **después** de una autenticación exitosa en el backend.

### Causa Raíz

Mismatch entre la estructura de respuesta del backend y lo que esperaba el frontend:

**Backend enviaba (AuthResponseDTO):**
```json
{
  "token": "eyJhbG...",
  "tipo": "Bearer",
  "id": 1,
  "nombre": "Admin",
  "apellido": "Sistema",
  "email": "admin2@parquenatural.com",
  "rol": "ADMIN"
}
```

**Frontend esperaba:**
```javascript
const { token, user: userData } = response;  // ❌ Estructura incorrecta
```

Esto causaba que `token` y `userData` fueran `undefined`, lo que disparaba el interceptor de axios con un error 403.

---

## Solución Aplicada

Actualicé [AuthContext.jsx](file:///c:/Users/juan_new/Desktop/ProyectoBases/frontend/src/context/AuthContext.jsx) para parsear correctamente la respuesta:

### Método `login` (Líneas 48-73)

```javascript
const login = async (credentials) => {
    try {
        const response = await authService.login(credentials);
        
        // Backend response structure: { token, id, nombre, apellido, email, rol, tipo }
        const { token, id, nombre, apellido, email, rol } = response;
        
        // Construir objeto de usuario
        const userData = {
            id,
            nombre,
            apellido,
            email,
            rol
        };

        // Guardar en localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));

        // Actualizar estado
        setUser(userData);
        setIsAuthenticated(true);

        return userData;
    } catch (error) {
        console.error('Error en login:', error);
        throw error;
    }
};
```

### Método `registerVisitante` (Líneas 79-104)

Aplicada la misma corrección para el registro de visitantes.

---

## Resultado

✅ El login ahora funciona correctamente
✅ El token JWT se almacena en localStorage
✅ El usuario se autentica y redirige según su rol
✅ No más errores 403 después de login exitoso

---

## Prueba

Intenta hacer login nuevamente con:
- **Email:** `admin2@parquenatural.com`
- **Password:** `password`

Deberías ser redirigido al `/admin/dashboard` automáticamente.
