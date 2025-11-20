# Instrucciones para Solucionar el Problema de Horarios

## Problema
Al intentar crear una reserva, aparece el error: "La hora seleccionada no está disponible para este sendero en el día indicado"

## Solución

### Paso 1: Ejecutar Script SQL (OBLIGATORIO)

Ejecuta el script `backend/scripts/fix_trigger_horario.sql` en tu base de datos Oracle.

**Cómo ejecutarlo:**
1. Abre SQL Developer, SQL*Plus o tu cliente de Oracle
2. Conéctate a tu base de datos
3. Ejecuta el contenido del archivo `fix_trigger_horario.sql`

Este script modifica el trigger para que:
- Solo valide horarios si hay horarios definidos para el sendero
- Si no hay horarios definidos, permite cualquier hora
- Si hay horarios definidos, valida que la hora esté dentro del rango

### Paso 2: Crear Horarios por Defecto (OPCIONAL pero recomendado)

Tienes dos opciones:

#### Opción A: Usar el Endpoint (Recomendado)

Llama al endpoint para crear horarios por defecto para cada sendero:

```bash
POST http://localhost:8081/api/horario/crear-por-defecto/{idSendero}
```

**Ejemplo:**
```bash
# Para el sendero con ID 1
curl -X POST http://localhost:8081/api/horario/crear-por-defecto/1

# Para el sendero con ID 2
curl -X POST http://localhost:8081/api/horario/crear-por-defecto/2
```

**Respuesta exitosa:**
```json
{
  "mensaje": "Horarios por defecto creados exitosamente",
  "horariosCreados": 7,
  "idSendero": 1
}
```

**Si ya tiene horarios:**
```json
{
  "mensaje": "El sendero ya tiene horarios definidos",
  "horariosCreados": 0
}
```

#### Opción B: Ejecutar Script SQL

Ejecuta el script `backend/scripts/fix_horarios_disponibles.sql` que crea horarios para todos los senderos activos.

## Verificación

Después de ejecutar el script SQL del Paso 1, intenta crear una reserva nuevamente. El error debería desaparecer.

Si quieres tener horarios específicos, usa el endpoint del Paso 2 para crear horarios de 06:00 a 17:00 para todos los días de la semana.

## Notas

- El script SQL del trigger es **obligatorio** - sin él, seguirás teniendo el error
- El endpoint es útil si no tienes acceso directo a la base de datos
- Los horarios por defecto son de 06:00 a 17:00 para todos los días
- Puedes modificar los horarios después usando el endpoint `/horario/save`

