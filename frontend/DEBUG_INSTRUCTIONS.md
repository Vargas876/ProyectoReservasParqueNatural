# 🔍 Debug de Problemas Actuales

## 1. NavBar solo muestra "Inicio" (ROL no detectado)

### Verificar localStorage en consola del browser:
```javascript
// Pega esto en la consola del navegador (F12)
console.log('User:', JSON.parse(localStorage.getItem('user')));
console.log('Token:', localStorage.getItem('token'));
```

**¿Qué debería mostrar?**
```javascript
{
  id: 2,
  nombre: "Pedro",
  apellido: "Rodriguez", 
  email: "pedro.rodriguez@parquenatural.com",
  rol: "GUIA",  // <-- DEBE existir este campo
  telefono: "3001234567",
  cedula: "1234567890",
  fechaRegistro: "2025-01-15",
  estado: "ACTIVO"
}
```

### Si `rol` está undefined o null:
El problema está en AuthContext al cargar el perfil completo.

---

## 2. GuiaSelector - Todos los guías se seleccionan

### Verificar en consola:
```javascript
// Cuando estés en el modal de asignar guía, pega esto:
console.log('Guías disponibles:', /* ver el array */);
```

**Verificar que cada guía tenga `idUsuario` único:**
```javascript
[
  { idUsuario: 1, nombre: "Pedro", ... },
  { idUsuario: 2, nombre: "María", ... }
]
```

---

## 3. Error `/api/visitantes/NaN`

**Causa:** El `visitante.idUsuario` es `undefined`

### Solución temporal:
Antes de editar un visitante, verifica en consola:
```javascript
console.log('Visitante seleccionado:', visitante);
console.log('ID:', visitante.idUsuario);
```

---

## 🎯 Acción Inmediata

**Ejecuta en consola del browser (F12 → Console):**
```javascript
const userData = JSON.parse(localStorage.getItem('user'));
console.log('=== USER DATA ===');
console.log('Nombre:', userData?.nombre);
console.log('Rol:', userData?.rol);
console.log('ID:', userData?.id);
console.log('Full object:', userData);
```

**Copia y pégame el resultado completo**
