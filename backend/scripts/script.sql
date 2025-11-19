--------------------------------------------------------
-- Script Completo: Sistema de Gestión de Reservas
-- Parque Natural - Base de Datos Oracle
-- Versión Mejorada: Noviembre 2025
-- Incluye: Constraints, Triggers, Vistas, Procedures, Roles
--------------------------------------------------------

-- =====================================================
-- SECCIÓN 1: LIMPIEZA (Opcional - Cuidado en producción)
-- =====================================================
/*
BEGIN
    FOR c IN (SELECT table_name FROM user_tables WHERE table_name IN 
              ('ASIGNACION_GUIA','RESERVA','HORARIO_DISPONIBLE','GUIA','SENDERO','VISITANTE')) 
    LOOP
        EXECUTE IMMEDIATE 'DROP TABLE ' || c.table_name || ' CASCADE CONSTRAINTS';
    END LOOP;
    
    FOR s IN (SELECT sequence_name FROM user_sequences WHERE sequence_name LIKE 'SEQ_%')
    LOOP
        EXECUTE IMMEDIATE 'DROP SEQUENCE ' || s.sequence_name;
    END LOOP;
END;
/
*/

-- =====================================================
-- SECCIÓN 2: SECUENCIAS
-- =====================================================

CREATE SEQUENCE SEQ_VISITANTE
    START WITH 1
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

CREATE SEQUENCE SEQ_SENDERO
    START WITH 1
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

CREATE SEQUENCE SEQ_RESERVA
    START WITH 1
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

CREATE SEQUENCE SEQ_GUIA
    START WITH 1
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

CREATE SEQUENCE SEQ_ASIGNACION
    START WITH 1
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

CREATE SEQUENCE SEQ_HORARIO
    START WITH 1
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

-- =====================================================
-- SECCIÓN 3: TABLAS
-- =====================================================

-- Tabla: VISITANTE
CREATE TABLE VISITANTE (
    ID_VISITANTE        NUMBER(10) NOT NULL,
    CEDULA              VARCHAR2(20) NOT NULL,
    NOMBRE              VARCHAR2(100) NOT NULL,
    APELLIDO            VARCHAR2(100) NOT NULL,
    EMAIL               VARCHAR2(150) NOT NULL,
    TELEFONO            VARCHAR2(20),
    FECHA_REGISTRO      DATE DEFAULT SYSDATE,
    ESTADO              VARCHAR2(20) DEFAULT 'ACTIVO',
    FECHA_NACIMIENTO    DATE,
    DIRECCION           VARCHAR2(200)
);

-- Tabla: SENDERO
CREATE TABLE SENDERO (
    ID_SENDERO          NUMBER(10) NOT NULL,
    NOMBRE              VARCHAR2(200) NOT NULL,
    DESCRIPCION         CLOB,
    DIFICULTAD          VARCHAR2(20) NOT NULL,
    DISTANCIA_KM        NUMBER(5,2),
    DURACION_HORAS      NUMBER(4,2) NOT NULL,
    CUPO_MAXIMO_DIA     NUMBER(5) DEFAULT 50,
    ESTADO              VARCHAR2(20) DEFAULT 'ACTIVO',
    REQUIERE_GUIA       CHAR(1) DEFAULT 'N',
    ALTITUD_MAXIMA      NUMBER(6),
    FECHA_CREACION      DATE DEFAULT SYSDATE,
    FECHA_MODIFICACION  DATE
);

-- Tabla: RESERVA
CREATE TABLE RESERVA (
    ID_RESERVA          NUMBER(10) NOT NULL,
    ID_VISITANTE        NUMBER(10) NOT NULL,
    ID_SENDERO          NUMBER(10) NOT NULL,
    FECHA_RESERVA       DATE DEFAULT SYSDATE,
    FECHA_VISITA        DATE NOT NULL,
    NUMERO_PERSONAS     NUMBER(3) NOT NULL,
    HORA_INICIO         VARCHAR2(5),
    ESTADO              VARCHAR2(20) DEFAULT 'PENDIENTE',
    OBSERVACIONES       VARCHAR2(500),
    FECHA_CREACION      DATE DEFAULT SYSDATE,
    FECHA_MODIFICACION  DATE,
    COSTO_TOTAL         NUMBER(10,2),
    CODIGO_CONFIRMACION VARCHAR2(50)
);

-- Tabla: GUIA
CREATE TABLE GUIA (
    ID_GUIA             NUMBER(10) NOT NULL,
    CEDULA              VARCHAR2(20) NOT NULL,
    NOMBRE              VARCHAR2(100) NOT NULL,
    APELLIDO            VARCHAR2(100) NOT NULL,
    EMAIL               VARCHAR2(150) NOT NULL,
    TELEFONO            VARCHAR2(20) NOT NULL,
    ESPECIALIDAD        VARCHAR2(200),
    FECHA_CONTRATACION  DATE DEFAULT SYSDATE,
    ESTADO              VARCHAR2(20) DEFAULT 'ACTIVO',
    CERTIFICACIONES     VARCHAR2(500),
    CALIFICACION_PROMEDIO NUMBER(3,2)
);

-- Tabla: ASIGNACION_GUIA
CREATE TABLE ASIGNACION_GUIA (
    ID_ASIGNACION       NUMBER(10) NOT NULL,
    ID_RESERVA          NUMBER(10) NOT NULL,
    ID_GUIA             NUMBER(10) NOT NULL,
    FECHA_ASIGNACION    DATE DEFAULT SYSDATE,
    OBSERVACIONES_GUIA  VARCHAR2(500),
    HORA_INICIO_REAL    VARCHAR2(5),
    HORA_FIN_REAL       VARCHAR2(5),
    CALIFICACION        NUMBER(2)
);

-- Tabla: HORARIO_DISPONIBLE
CREATE TABLE HORARIO_DISPONIBLE (
    ID_HORARIO          NUMBER(10) NOT NULL,
    ID_SENDERO          NUMBER(10) NOT NULL,
    DIA_SEMANA          VARCHAR2(20),
    HORA_INICIO         VARCHAR2(5) NOT NULL,
    HORA_FIN            VARCHAR2(5) NOT NULL,
    CUPO_POR_HORARIO    NUMBER(3),
    ESTADO              VARCHAR2(20) DEFAULT 'ACTIVO'
);

-- =====================================================
-- SECCIÓN 4: CONSTRAINTS - PRIMARY KEYS
-- =====================================================

ALTER TABLE VISITANTE 
    ADD CONSTRAINT PK_VISITANTE PRIMARY KEY (ID_VISITANTE);

ALTER TABLE SENDERO 
    ADD CONSTRAINT PK_SENDERO PRIMARY KEY (ID_SENDERO);

ALTER TABLE RESERVA 
    ADD CONSTRAINT PK_RESERVA PRIMARY KEY (ID_RESERVA);

ALTER TABLE GUIA 
    ADD CONSTRAINT PK_GUIA PRIMARY KEY (ID_GUIA);

ALTER TABLE ASIGNACION_GUIA 
    ADD CONSTRAINT PK_ASIGNACION_GUIA PRIMARY KEY (ID_ASIGNACION);

ALTER TABLE HORARIO_DISPONIBLE 
    ADD CONSTRAINT PK_HORARIO_DISPONIBLE PRIMARY KEY (ID_HORARIO);

-- =====================================================
-- SECCIÓN 5: CONSTRAINTS - FOREIGN KEYS
-- =====================================================

ALTER TABLE RESERVA 
    ADD CONSTRAINT FK_RESERVA_VISITANTE 
    FOREIGN KEY (ID_VISITANTE) 
    REFERENCES VISITANTE(ID_VISITANTE)
    ON DELETE CASCADE;

ALTER TABLE RESERVA 
    ADD CONSTRAINT FK_RESERVA_SENDERO 
    FOREIGN KEY (ID_SENDERO) 
    REFERENCES SENDERO(ID_SENDERO)
    ON DELETE CASCADE;

ALTER TABLE ASIGNACION_GUIA 
    ADD CONSTRAINT FK_ASIGNACION_RESERVA 
    FOREIGN KEY (ID_RESERVA) 
    REFERENCES RESERVA(ID_RESERVA)
    ON DELETE CASCADE;

ALTER TABLE ASIGNACION_GUIA 
    ADD CONSTRAINT FK_ASIGNACION_GUIA 
    FOREIGN KEY (ID_GUIA) 
    REFERENCES GUIA(ID_GUIA)
    ON DELETE CASCADE;

ALTER TABLE HORARIO_DISPONIBLE 
    ADD CONSTRAINT FK_HORARIO_SENDERO 
    FOREIGN KEY (ID_SENDERO) 
    REFERENCES SENDERO(ID_SENDERO)
    ON DELETE CASCADE;

-- =====================================================
-- SECCIÓN 6: CONSTRAINTS - UNIQUE
-- =====================================================

ALTER TABLE VISITANTE 
    ADD CONSTRAINT UK_VISITANTE_CEDULA UNIQUE (CEDULA);

ALTER TABLE VISITANTE 
    ADD CONSTRAINT UK_VISITANTE_EMAIL UNIQUE (EMAIL);

ALTER TABLE GUIA 
    ADD CONSTRAINT UK_GUIA_CEDULA UNIQUE (CEDULA);

ALTER TABLE GUIA 
    ADD CONSTRAINT UK_GUIA_EMAIL UNIQUE (EMAIL);

ALTER TABLE SENDERO 
    ADD CONSTRAINT UK_SENDERO_NOMBRE UNIQUE (NOMBRE);

-- =====================================================
-- SECCIÓN 7: CONSTRAINTS - CHECK
-- =====================================================

ALTER TABLE VISITANTE 
    ADD CONSTRAINT CHK_VISITANTE_ESTADO 
    CHECK (ESTADO IN ('ACTIVO', 'INACTIVO', 'BLOQUEADO'));

ALTER TABLE SENDERO 
    ADD CONSTRAINT CHK_SENDERO_DIFICULTAD 
    CHECK (DIFICULTAD IN ('FACIL', 'MODERADO', 'DIFICIL', 'EXTREMO'));

ALTER TABLE SENDERO 
    ADD CONSTRAINT CHK_SENDERO_ESTADO 
    CHECK (ESTADO IN ('ACTIVO', 'INACTIVO', 'MANTENIMIENTO'));

ALTER TABLE SENDERO 
    ADD CONSTRAINT CHK_SENDERO_REQUIERE_GUIA 
    CHECK (REQUIERE_GUIA IN ('S', 'N'));

ALTER TABLE SENDERO
    ADD CONSTRAINT CHK_SENDERO_DISTANCIA
    CHECK (DISTANCIA_KM > 0);

ALTER TABLE SENDERO
    ADD CONSTRAINT CHK_SENDERO_DURACION
    CHECK (DURACION_HORAS > 0);

ALTER TABLE SENDERO
    ADD CONSTRAINT CHK_SENDERO_CUPO
    CHECK (CUPO_MAXIMO_DIA > 0 AND CUPO_MAXIMO_DIA <= 500);

ALTER TABLE RESERVA 
    ADD CONSTRAINT CHK_RESERVA_ESTADO 
    CHECK (ESTADO IN ('PENDIENTE', 'CONFIRMADA', 'COMPLETADA', 'CANCELADA'));

ALTER TABLE RESERVA 
    ADD CONSTRAINT CHK_RESERVA_PERSONAS 
    CHECK (NUMERO_PERSONAS > 0 AND NUMERO_PERSONAS <= 20);

ALTER TABLE RESERVA
    ADD CONSTRAINT CHK_RESERVA_FECHA_VISITA
    CHECK (FECHA_VISITA >= TRUNC(SYSDATE));

ALTER TABLE RESERVA
    ADD CONSTRAINT CHK_RESERVA_COSTO
    CHECK (COSTO_TOTAL >= 0);

ALTER TABLE GUIA 
    ADD CONSTRAINT CHK_GUIA_ESTADO 
    CHECK (ESTADO IN ('ACTIVO', 'INACTIVO', 'VACACIONES', 'LICENCIA'));

ALTER TABLE GUIA
    ADD CONSTRAINT CHK_GUIA_CALIFICACION
    CHECK (CALIFICACION_PROMEDIO IS NULL OR (CALIFICACION_PROMEDIO >= 0 AND CALIFICACION_PROMEDIO <= 5));

ALTER TABLE ASIGNACION_GUIA
    ADD CONSTRAINT CHK_ASIGNACION_CALIFICACION
    CHECK (CALIFICACION IS NULL OR (CALIFICACION >= 1 AND CALIFICACION <= 5));

ALTER TABLE HORARIO_DISPONIBLE
    ADD CONSTRAINT CHK_HORARIO_DIA_SEMANA
    CHECK (DIA_SEMANA IN ('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'));

ALTER TABLE HORARIO_DISPONIBLE
    ADD CONSTRAINT CHK_HORARIO_ESTADO
    CHECK (ESTADO IN ('ACTIVO', 'INACTIVO'));

-- =====================================================
-- SECCIÓN 8: ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices en columnas de búsqueda frecuente
CREATE INDEX IDX_VISITANTE_CEDULA ON VISITANTE(CEDULA);
CREATE INDEX IDX_VISITANTE_EMAIL ON VISITANTE(EMAIL);
CREATE INDEX IDX_VISITANTE_ESTADO ON VISITANTE(ESTADO);

CREATE INDEX IDX_SENDERO_NOMBRE ON SENDERO(NOMBRE);
CREATE INDEX IDX_SENDERO_ESTADO ON SENDERO(ESTADO);
CREATE INDEX IDX_SENDERO_DIFICULTAD ON SENDERO(DIFICULTAD);

CREATE INDEX IDX_GUIA_CEDULA ON GUIA(CEDULA);
CREATE INDEX IDX_GUIA_ESTADO ON GUIA(ESTADO);

-- Índices compuestos para consultas complejas
CREATE INDEX IDX_RESERVA_SENDERO_FECHA ON RESERVA(ID_SENDERO, FECHA_VISITA, ESTADO);
CREATE INDEX IDX_RESERVA_VISITANTE_FECHA ON RESERVA(ID_VISITANTE, FECHA_VISITA);
CREATE INDEX IDX_RESERVA_ESTADO_FECHA ON RESERVA(ESTADO, FECHA_VISITA);
CREATE INDEX IDX_RESERVA_FECHA_VISITA ON RESERVA(FECHA_VISITA);

CREATE INDEX IDX_ASIGNACION_GUIA ON ASIGNACION_GUIA(ID_GUIA, FECHA_ASIGNACION);
CREATE INDEX IDX_ASIGNACION_RESERVA ON ASIGNACION_GUIA(ID_RESERVA);

CREATE INDEX IDX_HORARIO_SENDERO ON HORARIO_DISPONIBLE(ID_SENDERO, DIA_SEMANA);

-- =====================================================
-- SECCIÓN 9: TRIGGERS - AUTO-INCREMENTO
-- =====================================================

-- Trigger: Auto-incremento ID_VISITANTE
CREATE OR REPLACE TRIGGER TRG_VISITANTE_BI
BEFORE INSERT ON VISITANTE
FOR EACH ROW
WHEN (NEW.ID_VISITANTE IS NULL)
BEGIN
    :NEW.ID_VISITANTE := SEQ_VISITANTE.NEXTVAL;
    IF :NEW.FECHA_REGISTRO IS NULL THEN
        :NEW.FECHA_REGISTRO := SYSDATE;
    END IF;
END;
/

-- Trigger: Auto-incremento ID_SENDERO
CREATE OR REPLACE TRIGGER TRG_SENDERO_BI
BEFORE INSERT ON SENDERO
FOR EACH ROW
WHEN (NEW.ID_SENDERO IS NULL)
BEGIN
    :NEW.ID_SENDERO := SEQ_SENDERO.NEXTVAL;
    IF :NEW.FECHA_CREACION IS NULL THEN
        :NEW.FECHA_CREACION := SYSDATE;
    END IF;
END;
/

-- Trigger: Auto-incremento ID_RESERVA y generación de código
CREATE OR REPLACE TRIGGER TRG_RESERVA_BI
BEFORE INSERT ON RESERVA
FOR EACH ROW
DECLARE
    v_codigo VARCHAR2(50);
BEGIN
    IF :NEW.ID_RESERVA IS NULL THEN
        :NEW.ID_RESERVA := SEQ_RESERVA.NEXTVAL;
    END IF;
    
    IF :NEW.FECHA_CREACION IS NULL THEN
        :NEW.FECHA_CREACION := SYSDATE;
    END IF;
    
    IF :NEW.FECHA_RESERVA IS NULL THEN
        :NEW.FECHA_RESERVA := SYSDATE;
    END IF;
    
    -- Generar código de confirmación único
    IF :NEW.CODIGO_CONFIRMACION IS NULL THEN
        v_codigo := 'RES-' || TO_CHAR(SYSDATE, 'YYYYMMDD') || '-' || 
                    LPAD(:NEW.ID_RESERVA, 6, '0');
        :NEW.CODIGO_CONFIRMACION := v_codigo;
    END IF;
END;
/

-- Trigger: Actualizar fecha de modificación en RESERVA
CREATE OR REPLACE TRIGGER TRG_RESERVA_BU
BEFORE UPDATE ON RESERVA
FOR EACH ROW
BEGIN
    :NEW.FECHA_MODIFICACION := SYSDATE;
END;
/

-- Trigger: Auto-incremento ID_GUIA
CREATE OR REPLACE TRIGGER TRG_GUIA_BI
BEFORE INSERT ON GUIA
FOR EACH ROW
WHEN (NEW.ID_GUIA IS NULL)
BEGIN
    :NEW.ID_GUIA := SEQ_GUIA.NEXTVAL;
    IF :NEW.FECHA_CONTRATACION IS NULL THEN
        :NEW.FECHA_CONTRATACION := SYSDATE;
    END IF;
END;
/

-- Trigger: Auto-incremento ID_ASIGNACION
CREATE OR REPLACE TRIGGER TRG_ASIGNACION_BI
BEFORE INSERT ON ASIGNACION_GUIA
FOR EACH ROW
WHEN (NEW.ID_ASIGNACION IS NULL)
BEGIN
    :NEW.ID_ASIGNACION := SEQ_ASIGNACION.NEXTVAL;
    IF :NEW.FECHA_ASIGNACION IS NULL THEN
        :NEW.FECHA_ASIGNACION := SYSDATE;
    END IF;
END;
/

-- Trigger: Auto-incremento ID_HORARIO
CREATE OR REPLACE TRIGGER TRG_HORARIO_BI
BEFORE INSERT ON HORARIO_DISPONIBLE
FOR EACH ROW
WHEN (NEW.ID_HORARIO IS NULL)
BEGIN
    :NEW.ID_HORARIO := SEQ_HORARIO.NEXTVAL;
END;
/

-- =====================================================
-- SECCIÓN 10: TRIGGERS - VALIDACIONES (COMPOUND)
-- =====================================================

-- Trigger Compuesto: Validar capacidad del sendero (Optimizado)
CREATE OR REPLACE TRIGGER TRG_VALIDAR_CAPACIDAD
FOR INSERT OR UPDATE OF ID_SENDERO, FECHA_VISITA, NUMERO_PERSONAS, ESTADO ON RESERVA
COMPOUND TRIGGER
    
    -- Colección para almacenar reservas a validar
    TYPE t_reserva_validar IS RECORD (
        id_sendero      NUMBER,
        fecha_visita    DATE,
        numero_personas NUMBER,
        estado          VARCHAR2(20),
        id_reserva      NUMBER
    );
    
    TYPE t_reservas IS TABLE OF t_reserva_validar INDEX BY PLS_INTEGER;
    v_reservas_validar t_reservas;
    v_index PLS_INTEGER := 0;
    
    -- Antes de cada fila, recopilar datos
    BEFORE EACH ROW IS
    BEGIN
        IF :NEW.ESTADO IN ('CONFIRMADA', 'PENDIENTE') THEN
            v_index := v_index + 1;
            v_reservas_validar(v_index).id_sendero := :NEW.ID_SENDERO;
            v_reservas_validar(v_index).fecha_visita := :NEW.FECHA_VISITA;
            v_reservas_validar(v_index).numero_personas := :NEW.NUMERO_PERSONAS;
            v_reservas_validar(v_index).estado := :NEW.ESTADO;
            v_reservas_validar(v_index).id_reserva := NVL(:NEW.ID_RESERVA, -1);
        END IF;
    END BEFORE EACH ROW;
    
    -- Después del statement, validar capacidad
    AFTER STATEMENT IS
        v_total_personas NUMBER;
        v_cupo_maximo NUMBER;
    BEGIN
        FOR i IN 1..v_reservas_validar.COUNT LOOP
            -- Obtener capacidad del sendero
            SELECT CUPO_MAXIMO_DIA 
            INTO v_cupo_maximo
            FROM SENDERO
            WHERE ID_SENDERO = v_reservas_validar(i).id_sendero;
            
            -- Calcular total de personas reservadas para esa fecha
            SELECT NVL(SUM(NUMERO_PERSONAS), 0) 
            INTO v_total_personas
            FROM RESERVA
            WHERE ID_SENDERO = v_reservas_validar(i).id_sendero
              AND FECHA_VISITA = v_reservas_validar(i).fecha_visita
              AND ESTADO IN ('CONFIRMADA', 'PENDIENTE')
              AND ID_RESERVA != v_reservas_validar(i).id_reserva;
            
            -- Validar capacidad
            IF (v_total_personas + v_reservas_validar(i).numero_personas) > v_cupo_maximo THEN
                RAISE_APPLICATION_ERROR(-20001, 
                    'Capacidad excedida para el sendero en la fecha ' || 
                    TO_CHAR(v_reservas_validar(i).fecha_visita, 'DD/MM/YYYY') ||
                    '. Cupo máximo: ' || v_cupo_maximo || 
                    ', Ya reservado: ' || v_total_personas ||
                    ', Solicitado: ' || v_reservas_validar(i).numero_personas ||
                    ', Disponible: ' || (v_cupo_maximo - v_total_personas));
            END IF;
        END LOOP;
        
        -- Limpiar colección para la siguiente operación
        v_reservas_validar.DELETE;
        v_index := 0;
    END AFTER STATEMENT;
    
END TRG_VALIDAR_CAPACIDAD;
/

-- Trigger: Validar disponibilidad de guía
CREATE OR REPLACE TRIGGER TRG_VALIDAR_GUIA_DISPONIBLE
BEFORE INSERT OR UPDATE ON ASIGNACION_GUIA
FOR EACH ROW
DECLARE
    v_conflictos NUMBER;
    v_fecha_visita DATE;
    v_hora_inicio VARCHAR2(5);
    v_estado_guia VARCHAR2(20);
BEGIN
    -- Verificar estado del guía
    SELECT ESTADO INTO v_estado_guia
    FROM GUIA
    WHERE ID_GUIA = :NEW.ID_GUIA;
    
    IF v_estado_guia != 'ACTIVO' THEN
        RAISE_APPLICATION_ERROR(-20002, 
            'El guía no está disponible. Estado actual: ' || v_estado_guia);
    END IF;
    
    -- Obtener fecha y hora de la reserva
    SELECT FECHA_VISITA, HORA_INICIO 
    INTO v_fecha_visita, v_hora_inicio
    FROM RESERVA
    WHERE ID_RESERVA = :NEW.ID_RESERVA;
    
    -- Verificar conflictos de horario
    SELECT COUNT(*)
    INTO v_conflictos
    FROM ASIGNACION_GUIA ag
    JOIN RESERVA r ON ag.ID_RESERVA = r.ID_RESERVA
    WHERE ag.ID_GUIA = :NEW.ID_GUIA
      AND ag.ID_ASIGNACION != NVL(:NEW.ID_ASIGNACION, -1)
      AND r.FECHA_VISITA = v_fecha_visita
      AND r.HORA_INICIO = v_hora_inicio
      AND r.ESTADO IN ('CONFIRMADA', 'PENDIENTE');
    
    IF v_conflictos > 0 THEN
        RAISE_APPLICATION_ERROR(-20003, 
            'El guía ya tiene una asignación para la fecha ' ||
            TO_CHAR(v_fecha_visita, 'DD/MM/YYYY') || ' a las ' || v_hora_inicio);
    END IF;
END;
/

-- Trigger: Validar horario disponible
CREATE OR REPLACE TRIGGER TRG_VALIDAR_HORARIO
BEFORE INSERT OR UPDATE OF HORA_INICIO, ID_SENDERO ON RESERVA
FOR EACH ROW
DECLARE
    v_horario_valido NUMBER;
    v_dia_semana VARCHAR2(20);
BEGIN
    IF :NEW.ESTADO IN ('PENDIENTE', 'CONFIRMADA') AND :NEW.HORA_INICIO IS NOT NULL THEN
        -- Obtener día de la semana
        SELECT UPPER(TO_CHAR(:NEW.FECHA_VISITA, 'DAY', 'NLS_DATE_LANGUAGE=SPANISH'))
        INTO v_dia_semana
        FROM DUAL;
        
        v_dia_semana := TRIM(v_dia_semana);
        
        -- Verificar si existe horario disponible
        SELECT COUNT(*)
        INTO v_horario_valido
        FROM HORARIO_DISPONIBLE
        WHERE ID_SENDERO = :NEW.ID_SENDERO
          AND DIA_SEMANA = v_dia_semana
          AND :NEW.HORA_INICIO >= HORA_INICIO
          AND :NEW.HORA_INICIO < HORA_FIN
          AND ESTADO = 'ACTIVO';
        
        IF v_horario_valido = 0 THEN
            RAISE_APPLICATION_ERROR(-20004, 
                'La hora ' || :NEW.HORA_INICIO || ' no está disponible para este sendero el día ' || v_dia_semana);
        END IF;
    END IF;
END;
/

-- Trigger: Actualizar calificación promedio del guía
CREATE OR REPLACE TRIGGER TRG_ACTUALIZAR_CALIFICACION_GUIA
AFTER INSERT OR UPDATE OF CALIFICACION ON ASIGNACION_GUIA
FOR EACH ROW
WHEN (NEW.CALIFICACION IS NOT NULL)
DECLARE
    v_promedio NUMBER(3,2);
BEGIN
    -- Calcular nuevo promedio
    SELECT ROUND(AVG(CALIFICACION), 2)
    INTO v_promedio
    FROM ASIGNACION_GUIA
    WHERE ID_GUIA = :NEW.ID_GUIA
      AND CALIFICACION IS NOT NULL;
    
    -- Actualizar calificación del guía
    UPDATE GUIA
    SET CALIFICACION_PROMEDIO = v_promedio
    WHERE ID_GUIA = :NEW.ID_GUIA;
END;
/

-- =====================================================
-- SECCIÓN 11: VISTAS
-- =====================================================

-- Vista: Disponibilidad por sendero y fecha
CREATE OR REPLACE VIEW V_DISPONIBILIDAD_SENDERO AS
SELECT 
    s.ID_SENDERO,
    s.NOMBRE AS SENDERO_NOMBRE,
    s.DIFICULTAD,
    s.DURACION_HORAS,
    s.CUPO_MAXIMO_DIA,
    r.FECHA_VISITA,
    NVL(SUM(CASE WHEN r.ESTADO IN ('CONFIRMADA', 'PENDIENTE') 
        THEN r.NUMERO_PERSONAS ELSE 0 END), 0) AS PERSONAS_RESERVADAS,
    s.CUPO_MAXIMO_DIA - NVL(SUM(CASE WHEN r.ESTADO IN ('CONFIRMADA', 'PENDIENTE') 
        THEN r.NUMERO_PERSONAS ELSE 0 END), 0) AS CUPOS_DISPONIBLES
FROM SENDERO s
LEFT JOIN RESERVA r ON s.ID_SENDERO = r.ID_SENDERO
WHERE s.ESTADO = 'ACTIVO'
GROUP BY s.ID_SENDERO, s.NOMBRE, s.DIFICULTAD, s.DURACION_HORAS, s.CUPO_MAXIMO_DIA, r.FECHA_VISITA;

-- Vista: Reservas completas con toda la información
CREATE OR REPLACE VIEW V_RESERVAS_COMPLETAS AS
SELECT 
    r.ID_RESERVA,
    r.CODIGO_CONFIRMACION,
    r.FECHA_RESERVA,
    r.FECHA_VISITA,
    r.HORA_INICIO,
    r.ESTADO,
    r.NUMERO_PERSONAS,
    r.COSTO_TOTAL,
    r.OBSERVACIONES,
    v.ID_VISITANTE,
    v.CEDULA AS VISITANTE_CEDULA,
    v.NOMBRE || ' ' || v.APELLIDO AS VISITANTE_NOMBRE_COMPLETO,
    v.EMAIL AS VISITANTE_EMAIL,
    v.TELEFONO AS VISITANTE_TELEFONO,
    s.ID_SENDERO,
    s.NOMBRE AS SENDERO_NOMBRE,
    s.DIFICULTAD AS SENDERO_DIFICULTAD,
    s.DISTANCIA_KM AS SENDERO_DISTANCIA,
    s.DURACION_HORAS AS SENDERO_DURACION,
    s.REQUIERE_GUIA,
    g.ID_GUIA,
    g.NOMBRE || ' ' || g.APELLIDO AS GUIA_NOMBRE_COMPLETO,
    g.TELEFONO AS GUIA_TELEFONO,
    g.ESPECIALIDAD AS GUIA_ESPECIALIDAD,
    ag.CALIFICACION AS CALIFICACION_GUIA,
    ag.OBSERVACIONES_GUIA
FROM RESERVA r
JOIN VISITANTE v ON r.ID_VISITANTE = v.ID_VISITANTE
JOIN SENDERO s ON r.ID_SENDERO = s.ID_SENDERO
LEFT JOIN ASIGNACION_GUIA ag ON r.ID_RESERVA = ag.ID_RESERVA
LEFT JOIN GUIA g ON ag.ID_GUIA = g.ID_GUIA;

-- Vista: Estadísticas por sendero
CREATE OR REPLACE VIEW V_ESTADISTICAS_SENDERO AS
SELECT 
    s.ID_SENDERO,
    s.NOMBRE,
    s.DIFICULTAD,
    s.DISTANCIA_KM,
    s.DURACION_HORAS,
    s.ESTADO,
    COUNT(DISTINCT r.ID_RESERVA) AS TOTAL_RESERVAS,
    SUM(CASE WHEN r.ESTADO = 'COMPLETADA' THEN 1 ELSE 0 END) AS RESERVAS_COMPLETADAS,
    SUM(CASE WHEN r.ESTADO = 'CANCELADA' THEN 1 ELSE 0 END) AS RESERVAS_CANCELADAS,
    SUM(CASE WHEN r.ESTADO IN ('PENDIENTE', 'CONFIRMADA') THEN 1 ELSE 0 END) AS RESERVAS_ACTIVAS,
    SUM(CASE WHEN r.ESTADO = 'COMPLETADA' THEN r.NUMERO_PERSONAS ELSE 0 END) AS TOTAL_VISITANTES_COMPLETADOS,
    ROUND(AVG(CASE WHEN r.ESTADO = 'COMPLETADA' THEN r.NUMERO_PERSONAS END), 2) AS PROMEDIO_PERSONAS_POR_RESERVA,
    SUM(CASE WHEN r.ESTADO = 'COMPLETADA' THEN r.COSTO_TOTAL ELSE 0 END) AS INGRESOS_TOTALES
FROM SENDERO s
LEFT JOIN RESERVA r ON s.ID_SENDERO = r.ID_SENDERO
GROUP BY s.ID_SENDERO, s.NOMBRE, s.DIFICULTAD, s.DISTANCIA_KM, s.DURACION_HORAS, s.ESTADO;

-- Vista: Guías con su desempeño
CREATE OR REPLACE VIEW V_DESEMPENO_GUIAS AS
SELECT 
    g.ID_GUIA,
    g.CEDULA,
    g.NOMBRE || ' ' || g.APELLIDO AS NOMBRE_COMPLETO,
    g.EMAIL,
    g.TELEFONO,
    g.ESPECIALIDAD,
    g.ESTADO,
    g.FECHA_CONTRATACION,
    g.CALIFICACION_PROMEDIO,
    COUNT(DISTINCT ag.ID_RESERVA) AS TOTAL_ASIGNACIONES,
    SUM(CASE WHEN r.ESTADO = 'COMPLETADA' THEN 1 ELSE 0 END) AS TOURS_COMPLETADOS,
    SUM(CASE WHEN r.ESTADO = 'CANCELADA' THEN 1 ELSE 0 END) AS TOURS_CANCELADOS,
    COUNT(CASE WHEN ag.CALIFICACION IS NOT NULL THEN 1 END) AS TOTAL_CALIFICACIONES
FROM GUIA g
LEFT JOIN ASIGNACION_GUIA ag ON g.ID_GUIA = ag.ID_GUIA
LEFT JOIN RESERVA r ON ag.ID_RESERVA = r.ID_RESERVA
GROUP BY g.ID_GUIA, g.CEDULA, g.NOMBRE, g.APELLIDO, g.EMAIL, g.TELEFONO, 
         g.ESPECIALIDAD, g.ESTADO, g.FECHA_CONTRATACION, g.CALIFICACION_PROMEDIO;

-- Vista: Reservas próximas (siguientes 30 días)
CREATE OR REPLACE VIEW V_RESERVAS_PROXIMAS AS
SELECT 
    r.ID_RESERVA,
    r.CODIGO_CONFIRMACION,
    r.FECHA_VISITA,
    r.HORA_INICIO,
    r.NUMERO_PERSONAS,
    r.ESTADO,
    v.NOMBRE || ' ' || v.APELLIDO AS VISITANTE_NOMBRE,
    v.TELEFONO AS VISITANTE_TELEFONO,
    v.EMAIL AS VISITANTE_EMAIL,
    s.NOMBRE AS SENDERO_NOMBRE,
    s.DIFICULTAD,
    g.NOMBRE || ' ' || g.APELLIDO AS GUIA_NOMBRE,
    TRUNC(r.FECHA_VISITA - SYSDATE) AS DIAS_FALTANTES
FROM RESERVA r
JOIN VISITANTE v ON r.ID_VISITANTE = v.ID_VISITANTE
JOIN SENDERO s ON r.ID_SENDERO = s.ID_SENDERO
LEFT JOIN ASIGNACION_GUIA ag ON r.ID_RESERVA = ag.ID_RESERVA
LEFT JOIN GUIA g ON ag.ID_GUIA = g.ID_GUIA
WHERE r.FECHA_VISITA BETWEEN TRUNC(SYSDATE) AND TRUNC(SYSDATE) + 30
  AND r.ESTADO IN ('CONFIRMADA', 'PENDIENTE')
ORDER BY r.FECHA_VISITA, r.HORA_INICIO;

-- =====================================================
-- SECCIÓN 12: PROCEDIMIENTOS ALMACENADOS
-- =====================================================

-- Procedimiento: Crear reserva con validaciones completas
CREATE OR REPLACE PROCEDURE SP_CREAR_RESERVA(
    p_cedula_visitante  IN VARCHAR2,
    p_id_sendero        IN NUMBER,
    p_fecha_visita      IN DATE,
    p_numero_personas   IN NUMBER,
    p_hora_inicio       IN VARCHAR2,
    p_observaciones     IN VARCHAR2 DEFAULT NULL,
    p_id_reserva        OUT NUMBER,
    p_codigo_confirmacion OUT VARCHAR2
) AS
    v_id_visitante NUMBER;
    v_disponibilidad NUMBER;
    v_requiere_guia CHAR(1);
    v_estado_sendero VARCHAR2(20);
BEGIN
    -- Validar fecha
    IF p_fecha_visita < TRUNC(SYSDATE) THEN
        RAISE_APPLICATION_ERROR(-20010, 'La fecha de visita debe ser igual o posterior a hoy');
    END IF;
    
    -- Validar número de personas
    IF p_numero_personas < 1 OR p_numero_personas > 20 THEN
        RAISE_APPLICATION_ERROR(-20011, 'El número de personas debe estar entre 1 y 20');
    END IF;
    
    -- Buscar visitante
    BEGIN
        SELECT ID_VISITANTE INTO v_id_visitante
        FROM VISITANTE
        WHERE CEDULA = p_cedula_visitante AND ESTADO = 'ACTIVO';
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE_APPLICATION_ERROR(-20012, 'Visitante no encontrado o inactivo');
    END;
    
    -- Verificar estado del sendero
    SELECT ESTADO, REQUIERE_GUIA
    INTO v_estado_sendero, v_requiere_guia
    FROM SENDERO
    WHERE ID_SENDERO = p_id_sendero;
    
    IF v_estado_sendero != 'ACTIVO' THEN
        RAISE_APPLICATION_ERROR(-20013, 
            'El sendero no está disponible. Estado: ' || v_estado_sendero);
    END IF;
    
    -- Verificar disponibilidad
    SELECT CUPOS_DISPONIBLES INTO v_disponibilidad
    FROM V_DISPONIBILIDAD_SENDERO
    WHERE ID_SENDERO = p_id_sendero
      AND (FECHA_VISITA = p_fecha_visita OR FECHA_VISITA IS NULL);
    
    v_disponibilidad := NVL(v_disponibilidad, 
        (SELECT CUPO_MAXIMO_DIA FROM SENDERO WHERE ID_SENDERO = p_id_sendero));
    
    IF v_disponibilidad < p_numero_personas THEN
        RAISE_APPLICATION_ERROR(-20014, 
            'No hay suficientes cupos disponibles. Disponibles: ' || v_disponibilidad);
    END IF;
    
    -- Crear reserva
    INSERT INTO RESERVA (
        ID_VISITANTE, ID_SENDERO, FECHA_VISITA, 
        NUMERO_PERSONAS, HORA_INICIO, ESTADO, OBSERVACIONES
    ) VALUES (
        v_id_visitante, p_id_sendero, p_fecha_visita,
        p_numero_personas, p_hora_inicio, 'PENDIENTE', p_observaciones
    ) RETURNING ID_RESERVA, CODIGO_CONFIRMACION 
    INTO p_id_reserva, p_codigo_confirmacion;
    
    COMMIT;
    
    DBMS_OUTPUT.PUT_LINE('Reserva creada exitosamente. ID: ' || p_id_reserva || 
                        ', Código: ' || p_codigo_confirmacion);
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END SP_CREAR_RESERVA;
/

-- Procedimiento: Asignar guía automáticamente
CREATE OR REPLACE PROCEDURE SP_ASIGNAR_GUIA_AUTO(
    p_id_reserva IN NUMBER,
    p_id_guia_asignado OUT NUMBER
) AS
    v_id_sendero NUMBER;
    v_fecha_visita DATE;
    v_hora_inicio VARCHAR2(5);
    v_requiere_guia CHAR(1);
BEGIN
    -- Obtener información de la reserva
    SELECT r.ID_SENDERO, r.FECHA_VISITA, r.HORA_INICIO, s.REQUIERE_GUIA
    INTO v_id_sendero, v_fecha_visita, v_hora_inicio, v_requiere_guia
    FROM RESERVA r
    JOIN SENDERO s ON r.ID_SENDERO = s.ID_SENDERO
    WHERE r.ID_RESERVA = p_id_reserva;
    
    IF v_requiere_guia = 'N' THEN
        RAISE_APPLICATION_ERROR(-20020, 'Este sendero no requiere guía');
    END IF;
    
    -- Buscar guía disponible (priorizar por menor carga y mejor calificación)
    BEGIN
        SELECT ID_GUIA INTO p_id_guia_asignado
        FROM (
            SELECT g.ID_GUIA,
                   COUNT(ag.ID_ASIGNACION) AS total_asignaciones,
                   NVL(g.CALIFICACION_PROMEDIO, 0) AS calificacion
            FROM GUIA g
            LEFT JOIN ASIGNACION_GUIA ag ON g.ID_GUIA = ag.ID_GUIA
            WHERE g.ESTADO = 'ACTIVO'
              AND NOT EXISTS (
                  SELECT 1
                  FROM ASIGNACION_GUIA ag2
                  JOIN RESERVA r2 ON ag2.ID_RESERVA = r2.ID_RESERVA
                  WHERE ag2.ID_GUIA = g.ID_GUIA
                    AND r2.FECHA_VISITA = v_fecha_visita
                    AND r2.HORA_INICIO = v_hora_inicio
                    AND r2.ESTADO IN ('CONFIRMADA', 'PENDIENTE')
              )
            GROUP BY g.ID_GUIA, g.CALIFICACION_PROMEDIO
            ORDER BY total_asignaciones ASC, calificacion DESC
        ) WHERE ROWNUM = 1;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE_APPLICATION_ERROR(-20021, 
                'No hay guías disponibles para esta fecha y hora');
    END;
    
    -- Crear asignación
    INSERT INTO ASIGNACION_GUIA (ID_RESERVA, ID_GUIA)
    VALUES (p_id_reserva, p_id_guia_asignado);
    
    COMMIT;
    
    DBMS_OUTPUT.PUT_LINE('Guía asignado exitosamente. ID Guía: ' || p_id_guia_asignado);
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END SP_ASIGNAR_GUIA_AUTO;
/

-- Procedimiento: Cancelar reserva
CREATE OR REPLACE PROCEDURE SP_CANCELAR_RESERVA(
    p_id_reserva IN NUMBER,
    p_motivo IN VARCHAR2 DEFAULT NULL
) AS
    v_estado_actual VARCHAR2(20);
    v_fecha_visita DATE;
BEGIN
    -- Obtener estado actual
    SELECT ESTADO, FECHA_VISITA
    INTO v_estado_actual, v_fecha_visita
    FROM RESERVA
    WHERE ID_RESERVA = p_id_reserva;
    
    -- Validar que pueda cancelarse
    IF v_estado_actual = 'COMPLETADA' THEN
        RAISE_APPLICATION_ERROR(-20030, 'No se puede cancelar una reserva completada');
    END IF;
    
    IF v_estado_actual = 'CANCELADA' THEN
        RAISE_APPLICATION_ERROR(-20031, 'La reserva ya está cancelada');
    END IF;
    
    -- Actualizar estado
    UPDATE RESERVA
    SET ESTADO = 'CANCELADA',
        OBSERVACIONES = OBSERVACIONES || ' | CANCELADA: ' || 
                       NVL(p_motivo, 'Sin motivo especificado') ||
                       ' (Fecha cancelación: ' || TO_CHAR(SYSDATE, 'DD/MM/YYYY HH24:MI') || ')'
    WHERE ID_RESERVA = p_id_reserva;
    
    COMMIT;
    
    DBMS_OUTPUT.PUT_LINE('Reserva cancelada exitosamente');
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END SP_CANCELAR_RESERVA;
/

-- Procedimiento: Confirmar reserva
CREATE OR REPLACE PROCEDURE SP_CONFIRMAR_RESERVA(
    p_id_reserva IN NUMBER,
    p_costo_total IN NUMBER DEFAULT NULL
) AS
    v_estado_actual VARCHAR2(20);
BEGIN
    SELECT ESTADO INTO v_estado_actual
    FROM RESERVA
    WHERE ID_RESERVA = p_id_reserva;
    
    IF v_estado_actual != 'PENDIENTE' THEN
        RAISE_APPLICATION_ERROR(-20040, 
            'Solo se pueden confirmar reservas en estado PENDIENTE. Estado actual: ' || v_estado_actual);
    END IF;
    
    UPDATE RESERVA
    SET ESTADO = 'CONFIRMADA',
        COSTO_TOTAL = NVL(p_costo_total, COSTO_TOTAL)
    WHERE ID_RESERVA = p_id_reserva;
    
    COMMIT;
    
    DBMS_OUTPUT.PUT_LINE('Reserva confirmada exitosamente');
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END SP_CONFIRMAR_RESERVA;
/

-- Procedimiento: Completar reserva
CREATE OR REPLACE PROCEDURE SP_COMPLETAR_RESERVA(
    p_id_reserva IN NUMBER
) AS
    v_estado_actual VARCHAR2(20);
BEGIN
    SELECT ESTADO INTO v_estado_actual
    FROM RESERVA
    WHERE ID_RESERVA = p_id_reserva;
    
    IF v_estado_actual != 'CONFIRMADA' THEN
        RAISE_APPLICATION_ERROR(-20050, 
            'Solo se pueden completar reservas en estado CONFIRMADA');
    END IF;
    
    UPDATE RESERVA
    SET ESTADO = 'COMPLETADA'
    WHERE ID_RESERVA = p_id_reserva;
    
    COMMIT;
    
    DBMS_OUTPUT.PUT_LINE('Reserva completada exitosamente');
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END SP_COMPLETAR_RESERVA;
/

-- =====================================================
-- SECCIÓN 13: FUNCIONES ÚTILES
-- =====================================================

-- Función: Obtener cupos disponibles para un sendero en una fecha
CREATE OR REPLACE FUNCTION FN_CUPOS_DISPONIBLES(
    p_id_sendero IN NUMBER,
    p_fecha_visita IN DATE
) RETURN NUMBER IS
    v_cupo_maximo NUMBER;
    v_reservados NUMBER;
BEGIN
    SELECT CUPO_MAXIMO_DIA INTO v_cupo_maximo
    FROM SENDERO
    WHERE ID_SENDERO = p_id_sendero;
    
    SELECT NVL(SUM(NUMERO_PERSONAS), 0) INTO v_reservados
    FROM RESERVA
    WHERE ID_SENDERO = p_id_sendero
      AND FECHA_VISITA = p_fecha_visita
      AND ESTADO IN ('CONFIRMADA', 'PENDIENTE');
    
    RETURN (v_cupo_maximo - v_reservados);
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RETURN 0;
    WHEN OTHERS THEN
        RETURN -1;
END FN_CUPOS_DISPONIBLES;
/

-- Función: Verificar si un guía está disponible
CREATE OR REPLACE FUNCTION FN_GUIA_DISPONIBLE(
    p_id_guia IN NUMBER,
    p_fecha IN DATE,
    p_hora IN VARCHAR2
) RETURN NUMBER IS
    v_conflictos NUMBER;
    v_estado VARCHAR2(20);
BEGIN
    -- Verificar estado
    SELECT ESTADO INTO v_estado
    FROM GUIA
    WHERE ID_GUIA = p_id_guia;
    
    IF v_estado != 'ACTIVO' THEN
        RETURN 0;
    END IF;
    
    -- Verificar conflictos
    SELECT COUNT(*) INTO v_conflictos
    FROM ASIGNACION_GUIA ag
    JOIN RESERVA r ON ag.ID_RESERVA = r.ID_RESERVA
    WHERE ag.ID_GUIA = p_id_guia
      AND r.FECHA_VISITA = p_fecha
      AND r.HORA_INICIO = p_hora
      AND r.ESTADO IN ('CONFIRMADA', 'PENDIENTE');
    
    RETURN CASE WHEN v_conflictos = 0 THEN 1 ELSE 0 END;
EXCEPTION
    WHEN OTHERS THEN
        RETURN 0;
END FN_GUIA_DISPONIBLE;
/

-- =====================================================
-- SECCIÓN 14: ROLES Y SEGURIDAD
-- =====================================================

-- Crear roles
CREATE ROLE ROL_ADMIN_PARQUE;
CREATE ROLE ROL_GUIA;
CREATE ROLE ROL_RECEPCIONISTA;
CREATE ROLE ROL_VISITANTE_WEB;

-- Permisos para Administrador (acceso completo)
GRANT ALL ON VISITANTE TO ROL_ADMIN_PARQUE;
GRANT ALL ON SENDERO TO ROL_ADMIN_PARQUE;
GRANT ALL ON RESERVA TO ROL_ADMIN_PARQUE;
GRANT ALL ON GUIA TO ROL_ADMIN_PARQUE;
GRANT ALL ON ASIGNACION_GUIA TO ROL_ADMIN_PARQUE;
GRANT ALL ON HORARIO_DISPONIBLE TO ROL_ADMIN_PARQUE;

GRANT SELECT ON V_DISPONIBILIDAD_SENDERO TO ROL_ADMIN_PARQUE;
GRANT SELECT ON V_RESERVAS_COMPLETAS TO ROL_ADMIN_PARQUE;
GRANT SELECT ON V_ESTADISTICAS_SENDERO TO ROL_ADMIN_PARQUE;
GRANT SELECT ON V_DESEMPENO_GUIAS TO ROL_ADMIN_PARQUE;
GRANT SELECT ON V_RESERVAS_PROXIMAS TO ROL_ADMIN_PARQUE;

GRANT EXECUTE ON SP_CREAR_RESERVA TO ROL_ADMIN_PARQUE;
GRANT EXECUTE ON SP_ASIGNAR_GUIA_AUTO TO ROL_ADMIN_PARQUE;
GRANT EXECUTE ON SP_CANCELAR_RESERVA TO ROL_ADMIN_PARQUE;
GRANT EXECUTE ON SP_CONFIRMAR_RESERVA TO ROL_ADMIN_PARQUE;
GRANT EXECUTE ON SP_COMPLETAR_RESERVA TO ROL_ADMIN_PARQUE;

-- Permisos para Guías (consulta de sus asignaciones)
GRANT SELECT ON ASIGNACION_GUIA TO ROL_GUIA;
GRANT SELECT ON RESERVA TO ROL_GUIA;
GRANT SELECT ON VISITANTE TO ROL_GUIA;
GRANT SELECT ON SENDERO TO ROL_GUIA;
GRANT SELECT ON V_RESERVAS_COMPLETAS TO ROL_GUIA;
GRANT UPDATE (OBSERVACIONES_GUIA, HORA_INICIO_REAL, HORA_FIN_REAL, CALIFICACION) 
    ON ASIGNACION_GUIA TO ROL_GUIA;

-- Permisos para Recepcionistas
GRANT SELECT, INSERT, UPDATE ON RESERVA TO ROL_RECEPCIONISTA;
GRANT SELECT, INSERT, UPDATE ON VISITANTE TO ROL_RECEPCIONISTA;
GRANT SELECT ON SENDERO TO ROL_RECEPCIONISTA;
GRANT SELECT ON GUIA TO ROL_RECEPCIONISTA;
GRANT SELECT, INSERT ON ASIGNACION_GUIA TO ROL_RECEPCIONISTA;
GRANT SELECT ON HORARIO_DISPONIBLE TO ROL_RECEPCIONISTA;

GRANT SELECT ON V_DISPONIBILIDAD_SENDERO TO ROL_RECEPCIONISTA;
GRANT SELECT ON V_RESERVAS_COMPLETAS TO ROL_RECEPCIONISTA;
GRANT SELECT ON V_RESERVAS_PROXIMAS TO ROL_RECEPCIONISTA;

GRANT EXECUTE ON SP_CREAR_RESERVA TO ROL_RECEPCIONISTA;
GRANT EXECUTE ON SP_ASIGNAR_GUIA_AUTO TO ROL_RECEPCIONISTA;
GRANT EXECUTE ON SP_CANCELAR_RESERVA TO ROL_RECEPCIONISTA;
GRANT EXECUTE ON SP_CONFIRMAR_RESERVA TO ROL_RECEPCIONISTA;
GRANT EXECUTE ON FN_CUPOS_DISPONIBLES TO ROL_RECEPCIONISTA;
GRANT EXECUTE ON FN_GUIA_DISPONIBLE TO ROL_RECEPCIONISTA;

-- Permisos para Sistema Web (aplicación pública)
GRANT SELECT ON SENDERO TO ROL_VISITANTE_WEB;
GRANT SELECT ON HORARIO_DISPONIBLE TO ROL_VISITANTE_WEB;
GRANT SELECT, INSERT ON RESERVA TO ROL_VISITANTE_WEB;
GRANT SELECT, INSERT, UPDATE ON VISITANTE TO ROL_VISITANTE_WEB;

GRANT SELECT ON V_DISPONIBILIDAD_SENDERO TO ROL_VISITANTE_WEB;
GRANT EXECUTE ON SP_CREAR_RESERVA TO ROL_VISITANTE_WEB;
GRANT EXECUTE ON FN_CUPOS_DISPONIBLES TO ROL_VISITANTE_WEB;

-- =====================================================
-- SECCIÓN 15: DATOS DE PRUEBA
-- =====================================================

-- Insertar Senderos
INSERT INTO SENDERO (NOMBRE, DESCRIPCION, DIFICULTAD, DISTANCIA_KM, DURACION_HORAS, CUPO_MAXIMO_DIA, REQUIERE_GUIA) 
VALUES ('Sendero del Bosque Encantado', 'Recorrido por bosque nativo con flora y fauna local', 'FACIL', 3.5, 2.0, 30, 'N');

INSERT INTO SENDERO (NOMBRE, DESCRIPCION, DIFICULTAD, DISTANCIA_KM, DURACION_HORAS, CUPO_MAXIMO_DIA, REQUIERE_GUIA) 
VALUES ('Cascada Los Tres Saltos', 'Ruta hacia cascadas impresionantes', 'MODERADO', 5.8, 3.5, 25, 'S');

INSERT INTO SENDERO (NOMBRE, DESCRIPCION, DIFICULTAD, DISTANCIA_KM, DURACION_HORAS, CUPO_MAXIMO_DIA, REQUIERE_GUIA) 
VALUES ('Cumbre del Mirador', 'Ascenso a la cima con vista panorámica', 'DIFICIL', 8.2, 5.0, 15, 'S');

INSERT INTO SENDERO (NOMBRE, DESCRIPCION, DIFICULTAD, DISTANCIA_KM, DURACION_HORAS, CUPO_MAXIMO_DIA, REQUIERE_GUIA) 
VALUES ('Laguna Azul', 'Caminata familiar alrededor de la laguna', 'FACIL', 2.0, 1.5, 40, 'N');

-- Insertar Horarios Disponibles
INSERT INTO HORARIO_DISPONIBLE (ID_SENDERO, DIA_SEMANA, HORA_INICIO, HORA_FIN, CUPO_POR_HORARIO) 
VALUES (1, 'LUNES', '08:00', '10:00', 15);
INSERT INTO HORARIO_DISPONIBLE (ID_SENDERO, DIA_SEMANA, HORA_INICIO, HORA_FIN, CUPO_POR_HORARIO) 
VALUES (1, 'LUNES', '14:00', '16:00', 15);

INSERT INTO HORARIO_DISPONIBLE (ID_SENDERO, DIA_SEMANA, HORA_INICIO, HORA_FIN, CUPO_POR_HORARIO) 
VALUES (2, 'MARTES', '09:00', '12:30', 12);
INSERT INTO HORARIO_DISPONIBLE (ID_SENDERO, DIA_SEMANA, HORA_INICIO, HORA_FIN, CUPO_POR_HORARIO) 
VALUES (2, 'JUEVES', '09:00', '12:30', 13);

INSERT INTO HORARIO_DISPONIBLE (ID_SENDERO, DIA_SEMANA, HORA_INICIO, HORA_FIN, CUPO_POR_HORARIO) 
VALUES (3, 'SABADO', '07:00', '12:00', 15);

INSERT INTO HORARIO_DISPONIBLE (ID_SENDERO, DIA_SEMANA, HORA_INICIO, HORA_FIN, CUPO_POR_HORARIO) 
VALUES (4, 'DOMINGO', '10:00', '11:30', 20);
INSERT INTO HORARIO_DISPONIBLE (ID_SENDERO, DIA_SEMANA, HORA_INICIO, HORA_FIN, CUPO_POR_HORARIO) 
VALUES (4, 'DOMINGO', '15:00', '16:30', 20);

-- Insertar Guías
INSERT INTO GUIA (CEDULA, NOMBRE, APELLIDO, EMAIL, TELEFONO, ESPECIALIDAD) 
VALUES ('1234567890', 'Carlos', 'Rodríguez', 'carlos.rodriguez@parque.com', '3001234567', 'Ornitología y Botánica');

INSERT INTO GUIA (CEDULA, NOMBRE, APELLIDO, EMAIL, TELEFONO, ESPECIALIDAD) 
VALUES ('0987654321', 'María', 'González', 'maria.gonzalez@parque.com', '3109876543', 'Geología y Senderismo de Montaña');

INSERT INTO GUIA (CEDULA, NOMBRE, APELLIDO, EMAIL, TELEFONO, ESPECIALIDAD) 
VALUES ('1122334455', 'Pedro', 'Martínez', 'pedro.martinez@parque.com', '3201122334', 'Fotografía de Naturaleza');

-- Insertar Visitantes de prueba
INSERT INTO VISITANTE (CEDULA, NOMBRE, APELLIDO, EMAIL, TELEFONO, FECHA_NACIMIENTO) 
VALUES ('52123456', 'Ana', 'Pérez', 'ana.perez@email.com', '3151234567', TO_DATE('1990-05-15', 'YYYY-MM-DD'));

INSERT INTO VISITANTE (CEDULA, NOMBRE, APELLIDO, EMAIL, TELEFONO, FECHA_NACIMIENTO) 
VALUES ('52234567', 'Luis', 'Ramírez', 'luis.ramirez@email.com', '3162345678', TO_DATE('1985-08-22', 'YYYY-MM-DD'));

INSERT INTO VISITANTE (CEDULA, NOMBRE, APELLIDO, EMAIL, TELEFONO, FECHA_NACIMIENTO) 
VALUES ('52345678', 'Laura', 'Torres', 'laura.torres@email.com', '3173456789', TO_DATE('1995-12-10', 'YYYY-MM-DD'));

COMMIT;

-- =====================================================
-- SCRIPT COMPLETO - FIN
-- =====================================================

-- Mensaje de confirmación
BEGIN
    DBMS_OUTPUT.PUT_LINE('==============================================');
    DBMS_OUTPUT.PUT_LINE('SCRIPT COMPLETADO EXITOSAMENTE');
    DBMS_OUTPUT.PUT_LINE('==============================================');
    DBMS_OUTPUT.PUT_LINE('Tablas creadas: 6');
    DBMS_OUTPUT.PUT_LINE('Triggers creados: 11');
    DBMS_OUTPUT.PUT_LINE('Vistas creadas: 5');
    DBMS_OUTPUT.PUT_LINE('Procedimientos: 5');
    DBMS_OUTPUT.PUT_LINE('Funciones: 2');
    DBMS_OUTPUT.PUT_LINE('Roles: 4');
    DBMS_OUTPUT.PUT_LINE('==============================================');
END;
/
