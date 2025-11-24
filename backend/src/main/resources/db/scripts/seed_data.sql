-- ============================================================================
-- Script: seed_data.sql
-- Descripción: Insertar datos de prueba en la base de datos
-- ============================================================================

SET SERVEROUTPUT ON;

PROMPT Iniciando inserción de datos de prueba...

-- ============================================================================
-- USUARIOS BASE
-- ============================================================================

-- ADMIN
-- Password: Admin123 (BCrypt: $2a$10$...)
INSERT INTO USUARIO (ID_USUARIO, CEDULA, NOMBRE, APELLIDO, TELEFONO, EMAIL, PASSWORD, ROL, ESTADO)
VALUES (SEQ_USUARIO.NEXTVAL, '1000000001', 'Carlos', 'Administrador', '3001234567', 
        'admin@parquenatural.com', 
        '$2a$10$8ZVoYdJ7X8K7Q6ZkZxZ6JeU.eW9MKN9YhZaXx0vJ9MYx9Yx9Yx9Yx', 
        'ADMIN', 'ACTIVO');

PROMPT Usuario ADMIN creado.

-- ============================================================================
-- VISITANTES
-- ============================================================================

-- Visitante 1 - Password: Visitante123
INSERT INTO USUARIO (ID_USUARIO, CEDULA, NOMBRE, APELLIDO, TELEFONO, EMAIL, PASSWORD, ROL, ESTADO)
VALUES (SEQ_USUARIO.NEXTVAL, '1000000002', 'María', 'García', '3109876543', 
        'maria.garcia@email.com', 
        '$2a$10$8ZVoYdJ7X8K7Q6ZkZxZ6JeU.eW9MKN9YhZaXx0vJ9MYx9Yx9Yx9Yx', 
        'VISITANTE', 'ACTIVO');

INSERT INTO VISITANTE (ID_USUARIO, NUMERO_VISITAS, PUNTUACION_PROMEDIO)
VALUES (SEQ_USUARIO.CURRVAL, 5, 4.50);

-- Visitante 2
INSERT INTO USUARIO (ID_USUARIO, CEDULA, NOMBRE, APELLIDO, TELEFONO, EMAIL, PASSWORD, ROL, ESTADO)
VALUES (SEQ_USUARIO.NEXTVAL, '1000000003', 'Juan', 'Pérez', '3201234567', 
        'juan.perez@email.com', 
        '$2a$10$8ZVoYdJ7X8K7Q6ZkZxZ6JeU.eW9MKN9YhZaXx0vJ9MYx9Yx9Yx9Yx', 
        'VISITANTE', 'ACTIVO');

INSERT INTO VISITANTE (ID_USUARIO, NUMERO_VISITAS, PUNTUACION_PROMEDIO)
VALUES (SEQ_USUARIO.CURRVAL, 3, 4.20);

-- Visitante 3
INSERT INTO USUARIO (ID_USUARIO, CEDULA, NOMBRE, APELLIDO, TELEFONO, EMAIL, PASSWORD, ROL, ESTADO)
VALUES (SEQ_USUARIO.NEXTVAL, '1000000004', 'Ana', 'Martínez', '3151234567', 
        'ana.martinez@email.com', 
        '$2a$10$8ZVoYdJ7X8K7Q6ZkZxZ6JeU.eW9MKN9YhZaXx0vJ9MYx9Yx9Yx9Yx', 
        'VISITANTE', 'ACTIVO');

INSERT INTO VISITANTE (ID_USUARIO, NUMERO_VISITAS, PUNTUACION_PROMEDIO)
VALUES (SEQ_USUARIO.CURRVAL, 1, 5.00);

PROMPT Visitantes creados.

-- ============================================================================
-- GUÍAS
-- ============================================================================

-- Guía 1 - Password: Guia123
INSERT INTO USUARIO (ID_USUARIO, CEDULA, NOMBRE, APELLIDO, TELEFONO, EMAIL, PASSWORD, ROL, ESTADO)
VALUES (SEQ_USUARIO.NEXTVAL, '1000000005', 'Pedro', 'Rodríguez', '3001112233', 
        'pedro.rodriguez@parquenatural.com', 
        '$2a$10$8ZVoYdJ7X8K7Q6ZkZxZ6JeU.eW9MKN9YhZaXx0vJ9MYx9Yx9Yx9Yx', 
        'GUIA', 'ACTIVO');

INSERT INTO GUIA (ID_USUARIO, ESPECIALIDADES, MAX_PERSONAS_GRUPO, CALIFICACION_PROMEDIO, NUMERO_RECORRIDOS)
VALUES (SEQ_USUARIO.CURRVAL, 'Avistamiento de aves, Flora nativa', 15, 4.80, 25);

-- Guía 2
INSERT INTO USUARIO (ID_USUARIO, CEDULA, NOMBRE, APELLIDO, TELEFONO, EMAIL, PASSWORD, ROL, ESTADO)
VALUES (SEQ_USUARIO.NEXTVAL, '1000000006', 'Laura', 'Gómez', '3002223344', 
        'laura.gomez@parquenatural.com', 
        '$2a$10$8ZVoYdJ7X8K7Q6ZkZxZ6JeU.eW9MKN9YhZaXx0vJ9MYx9Yx9Yx9Yx', 
        'GUIA', 'ACTIVO');

INSERT INTO GUIA (ID_USUARIO, ESPECIALIDADES, MAX_PERSONAS_GRUPO, CALIFICACION_PROMEDIO, NUMERO_RECORRIDOS)
VALUES (SEQ_USUARIO.CURRVAL, 'Senderismo de montaña, Fotografía de naturaleza', 12, 4.60, 18);

-- Guía 3
INSERT INTO USUARIO (ID_USUARIO, CEDULA, NOMBRE, APELLIDO, TELEFONO, EMAIL, PASSWORD, ROL, ESTADO)
VALUES (SEQ_USUARIO.NEXTVAL, '1000000007', 'Miguel', 'Torres', '3003334455', 
        'miguel.torres@parquenatural.com', 
        '$2a$10$8ZVoYdJ7X8K7Q6ZkZxZ6JeU.eW9MKN9YhZaXx0vJ9MYx9Yx9Yx9Yx', 
        'GUIA', 'ACTIVO');

INSERT INTO GUIA (ID_USUARIO, ESPECIALIDADES, MAX_PERSONAS_GRUPO, CALIFICACION_PROMEDIO, NUMERO_RECORRIDOS)
VALUES (SEQ_USUARIO.CURRVAL, 'Expediciones nocturnas, Fauna silvestre', 10, 4.90, 32);

PROMPT Guías creados.

-- ============================================================================
-- SENDEROS
-- ============================================================================

-- Sendero 1: Fácil
INSERT INTO SENDERO (ID_SENDERO, NOMBRE, DESCRIPCION, DIFICULTAD, DURACION_HORAS, 
                     CUPO_MAXIMO_DIA, DISTANCIA_KM, ESTADO)
VALUES (SEQ_SENDERO.NEXTVAL, 'Cascada El Edén', 
        'Sendero familiar que conduce a una hermosa cascada. Ideal para principiantes y familias con niños.', 
        'FACIL', 2.5, 50, 3.2, 'ACTIVO');

-- Sendero 2: Moderado
INSERT INTO SENDERO (ID_SENDERO, NOMBRE, DESCRIPCION, DIFICULTAD, DURACION_HORAS, 
                     CUPO_MAXIMO_DIA, DISTANCIA_KM, ESTADO)
VALUES (SEQ_SENDERO.NEXTVAL, 'Mirador del Cóndor', 
        'Recorrido con pendientes moderadas que lleva a un espectacular mirador con vista panorámica.', 
        'MODERADO', 4.0, 30, 6.5, 'ACTIVO');

-- Sendero 3: Difícil
INSERT INTO SENDERO (ID_SENDERO, NOMBRE, DESCRIPCION, DIFICULTAD, DURACION_HORAS, 
                     CUPO_MAXIMO_DIA, DISTANCIA_KM, ESTADO)
VALUES (SEQ_SENDERO.NEXTVAL, 'Pico del Águila', 
        'Sendero de alta montaña con terreno rocoso. Requiere buena condición física y experiencia.', 
        'DIFICIL', 6.5, 20, 10.8, 'ACTIVO');

-- Sendero 4: Experto
INSERT INTO SENDERO (ID_SENDERO, NOMBRE, DESCRIPCION, DIFICULTAD, DURACION_HORAS, 
                     CUPO_MAXIMO_DIA, DISTANCIA_KM, ESTADO)
VALUES (SEQ_SENDERO.NEXTVAL, 'Travesía Páramo Alto', 
        'Expedición de día completo a través del páramo. Solo para expertos en alta montaña.', 
        'EXPERTO', 8.0, 10, 15.5, 'ACTIVO');

-- Sendero 5: Fácil
INSERT INTO SENDERO (ID_SENDERO, NOMBRE, DESCRIPCION, DIFICULTAD, DURACION_HORAS, 
                     CUPO_MAXIMO_DIA, DISTANCIA_KM, ESTADO)
VALUES (SEQ_SENDERO.NEXTVAL, 'Bosque de las Orquídeas', 
        'Caminata tranquila por bosque de niebla con gran variedad de orquídeas y aves.', 
        'FACIL', 3.0, 40, 4.5, 'ACTIVO');

PROMPT Senderos creados.

-- ============================================================================
-- HORARIOS DISPONIBLES
-- ============================================================================

-- Horarios para Cascada El Edén (Sendero 1)
INSERT INTO HORARIO_DISPONIBLE (ID_HORARIO, ID_SENDERO, HORA_INICIO, HORA_FIN, CUPO_HORARIO, DIAS_SEMANA, ACTIVO)
VALUES (SEQ_HORARIO.NEXTVAL, 1, 
        TO_TIMESTAMP('08:00', 'HH24:MI'), TO_TIMESTAMP('10:30', 'HH24:MI'), 
        25, 'L,M,MI,J,V,S,D', 1);

INSERT INTO HORARIO_DISPONIBLE (ID_HORARIO, ID_SENDERO, HORA_INICIO, HORA_FIN, CUPO_HORARIO, DIAS_SEMANA, ACTIVO)
VALUES (SEQ_HORARIO.NEXTVAL, 1, 
        TO_TIMESTAMP('14:00', 'HH24:MI'), TO_TIMESTAMP('16:30', 'HH24:MI'), 
        25, 'L,M,MI,J,V,S,D', 1);

-- Horarios para Mirador del Cóndor (Sendero 2)
INSERT INTO HORARIO_DISPONIBLE (ID_HORARIO, ID_SENDERO, HORA_INICIO, HORA_FIN, CUPO_HORARIO, DIAS_SEMANA, ACTIVO)
VALUES (SEQ_HORARIO.NEXTVAL, 2, 
        TO_TIMESTAMP('07:00', 'HH24:MI'), TO_TIMESTAMP('11:00', 'HH24:MI'), 
        15, 'L,M,MI,J,V,S,D', 1);

INSERT INTO HORARIO_DISPONIBLE (ID_HORARIO, ID_SENDERO, HORA_INICIO, HORA_FIN, CUPO_HORARIO, DIAS_SEMANA, ACTIVO)
VALUES (SEQ_HORARIO.NEXTVAL, 2, 
        TO_TIMESTAMP('13:00', 'HH24:MI'), TO_TIMESTAMP('17:00', 'HH24:MI'), 
        15, 'L,M,MI,J,V', 1);

-- Horarios para Pico del Águila (Sendero 3)
INSERT INTO HORARIO_DISPONIBLE (ID_HORARIO, ID_SENDERO, HORA_INICIO, HORA_FIN, CUPO_HORARIO, DIAS_SEMANA, ACTIVO)
VALUES (SEQ_HORARIO.NEXTVAL, 3, 
        TO_TIMESTAMP('06:00', 'HH24:MI'), TO_TIMESTAMP('12:30', 'HH24:MI'), 
        10, 'S,D', 1);

-- Horarios para Travesía Páramo Alto (Sendero 4)
INSERT INTO HORARIO_DISPONIBLE (ID_HORARIO, ID_SENDERO, HORA_INICIO, HORA_FIN, CUPO_HORARIO, DIAS_SEMANA, ACTIVO)
VALUES (SEQ_HORARIO.NEXTVAL, 4, 
        TO_TIMESTAMP('05:00', 'HH24:MI'), TO_TIMESTAMP('13:00', 'HH24:MI'), 
        5, 'S,D', 1);

-- Horarios para Bosque de las Orquídeas (Sendero 5)
INSERT INTO HORARIO_DISPONIBLE (ID_HORARIO, ID_SENDERO, HORA_INICIO, HORA_FIN, CUPO_HORARIO, DIAS_SEMANA, ACTIVO)
VALUES (SEQ_HORARIO.NEXTVAL, 5, 
        TO_TIMESTAMP('09:00', 'HH24:MI'), TO_TIMESTAMP('12:00', 'HH24:MI'), 
        20, 'L,M,MI,J,V,S,D', 1);

INSERT INTO HORARIO_DISPONIBLE (ID_HORARIO, ID_SENDERO, HORA_INICIO, HORA_FIN, CUPO_HORARIO, DIAS_SEMANA, ACTIVO)
VALUES (SEQ_HORARIO.NEXTVAL, 5, 
        TO_TIMESTAMP('15:00', 'HH24:MI'), TO_TIMESTAMP('18:00', 'HH24:MI'), 
        20, 'L,M,MI,J,V,S,D', 1);

PROMPT Horarios disponibles creados.

-- ============================================================================
-- RESERVAS DE EJEMPLO (próximos días)
-- ============================================================================

-- Reserva 1: María para Cascada El Edén (mañana)
INSERT INTO RESERVA (ID_RESERVA, ID_VISITANTE, ID_SENDERO, FECHA_VISITA, NUMERO_PERSONAS, 
                     HORA_INICIO, ESTADO, OBSERVACIONES)
VALUES (SEQ_RESERVA.NEXTVAL, 2, 1, TRUNC(SYSDATE) + 2, 4, 
        TO_TIMESTAMP(TO_CHAR(TRUNC(SYSDATE) + 2, 'DD-MON-YYYY') || ' 08:00', 'DD-MON-YYYY HH24:MI'),
        'CONFIRMADA', 'Familia con dos niños');

-- Reserva 2: Juan para Mirador del Cóndor
INSERT INTO RESERVA (ID_RESERVA, ID_VISITANTE, ID_SENDERO, FECHA_VISITA, NUMERO_PERSONAS, 
                     HORA_INICIO, ESTADO)
VALUES (SEQ_RESERVA.NEXTVAL, 3, 2, TRUNC(SYSDATE) + 3, 2, 
        TO_TIMESTAMP(TO_CHAR(TRUNC(SYSDATE) + 3, 'DD-MON-YYYY') || ' 07:00', 'DD-MON-YYYY HH24:MI'),
        'PENDIENTE');

-- Reserva 3: Ana para Bosque de las Orquídeas
INSERT INTO RESERVA (ID_RESERVA, ID_VISITANTE, ID_SENDERO, FECHA_VISITA, NUMERO_PERSONAS, 
                     HORA_INICIO, ESTADO, OBSERVACIONES)
VALUES (SEQ_RESERVA.NEXTVAL, 4, 5, TRUNC(SYSDATE) + 5, 1, 
        TO_TIMESTAMP(TO_CHAR(TRUNC(SYSDATE) + 5, 'DD-MON-YYYY') || ' 09:00', 'DD-MON-YYYY HH24:MI'),
        'CONFIRMADA', 'Interesada en fotografía de flores');

PROMPT Reservas de ejemplo creadas.

-- ============================================================================
-- ASIGNACIONES DE GUÍA
-- ============================================================================

-- Asignar guía Pedro a reserva de María
INSERT INTO ASIGNACION_GUIA (ID_ASIGNACION, ID_RESERVA, ID_GUIA, FECHA_ASIGNACION)
VALUES (SEQ_ASIGNACION.NEXTVAL, 1, 5, TRUNC(SYSDATE));

-- Asignar guía Laura a reserva de Ana
INSERT INTO ASIGNACION_GUIA (ID_ASIGNACION, ID_RESERVA, ID_GUIA, FECHA_ASIGNACION)
VALUES (SEQ_ASIGNACION.NEXTVAL, 3, 6, TRUNC(SYSDATE));

PROMPT Asignaciones de guía creadas.

COMMIT;

PROMPT ============================================================
PROMPT Datos de prueba insertados exitosamente.
PROMPT ============================================================
PROMPT 
PROMPT USUARIOS DE PRUEBA:
PROMPT - Admin: admin@parquenatural.com / Admin123
PROMPT - Visitante: maria.garcia@email.com / Visitante123
PROMPT - Guía: pedro.rodriguez@parquenatural.com / Guia123
PROMPT ============================================================
