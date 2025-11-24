-- ============================================================================
-- Script: create_triggers.sql
-- Descripción: Triggers para validaciones automáticas y reglas de negocio
-- ============================================================================

SET SERVEROUTPUT ON;

PROMPT Iniciando creación de triggers...

-- ============================================================================
-- TRIGGER: Actualizar fecha de modificación en USUARIO
-- ============================================================================
CREATE OR REPLACE TRIGGER TRG_USUARIO_UPDATE
BEFORE UPDATE ON USUARIO
FOR EACH ROW
BEGIN
    :NEW.FECHA_ULTIMA_MODIFICACION := CURRENT_TIMESTAMP;
END;
/

PROMPT Trigger TRG_USUARIO_UPDATE creado.

-- ============================================================================
-- TRIGGER: Actualizar fecha de modificación en SENDERO
-- ============================================================================
CREATE OR REPLACE TRIGGER TRG_SENDERO_UPDATE
BEFORE UPDATE ON SENDERO
FOR EACH ROW
BEGIN
    :NEW.FECHA_MODIFICACION := CURRENT_TIMESTAMP;
END;
/

PROMPT Trigger TRG_SENDERO_UPDATE creado.

-- ============================================================================
-- TRIGGER: Validar cupo disponible antes de insertar RESERVA
-- ============================================================================
CREATE OR REPLACE TRIGGER TRG_VALIDAR_CUPO_RESERVA
BEFORE INSERT ON RESERVA
FOR EACH ROW
DECLARE
    v_cupo_maximo NUMBER;
    v_personas_reservadas NUMBER;
    v_cupo_disponible NUMBER;
BEGIN
    -- Obtener cupo máximo del sendero
    SELECT CUPO_MAXIMO_DIA INTO v_cupo_maximo
    FROM SENDERO
    WHERE ID_SENDERO = :NEW.ID_SENDERO;
    
    -- Calcular personas ya reservadas para esa fecha
    SELECT NVL(SUM(NUMERO_PERSONAS), 0) INTO v_personas_reservadas
    FROM RESERVA
    WHERE ID_SENDERO = :NEW.ID_SENDERO
      AND FECHA_VISITA = :NEW.FECHA_VISITA
      AND ESTADO IN ('PENDIENTE', 'CONFIRMADA');
    
    -- Calcular cupo disponible
    v_cupo_disponible := v_cupo_maximo - v_personas_reservadas;
    
    -- Validar que hay cupo suficiente
    IF :NEW.NUMERO_PERSONAS > v_cupo_disponible THEN
        RAISE_APPLICATION_ERROR(-20001, 
            'No hay cupo disponible. Cupo disponible: ' || v_cupo_disponible || 
            ', Solicitado: ' || :NEW.NUMERO_PERSONAS);
    END IF;
END;
/

PROMPT Trigger TRG_VALIDAR_CUPO_RESERVA creado.

-- ============================================================================
-- TRIGGER: Validar máximo de reservas activas por visitante
-- ============================================================================
CREATE OR REPLACE TRIGGER TRG_VALIDAR_MAX_RESERVAS
BEFORE INSERT ON RESERVA
FOR EACH ROW
DECLARE
    v_reservas_activas NUMBER;
BEGIN
    -- Contar reservas activas del visitante
    SELECT COUNT(*) INTO v_reservas_activas
    FROM RESERVA
    WHERE ID_VISITANTE = :NEW.ID_VISITANTE
      AND ESTADO IN ('PENDIENTE', 'CONFIRMADA');
    
    -- Validar máximo de 2 reservas activas
    IF v_reservas_activas >= 2 THEN
        RAISE_APPLICATION_ERROR(-20002, 
            'El visitante ya tiene el máximo de 2 reservas activas.');
    END IF;
END;
/

PROMPT Trigger TRG_VALIDAR_MAX_RESERVAS creado.

-- ============================================================================
-- TRIGGER: Validar anticipación mínima de 24 horas
-- ============================================================================
CREATE OR REPLACE TRIGGER TRG_VALIDAR_ANTICIPACION
BEFORE INSERT ON RESERVA
FOR EACH ROW
DECLARE
    v_horas_diferencia NUMBER;
BEGIN
    -- Calcular horas entre ahora y la fecha de visita
    v_horas_diferencia := ((:NEW.FECHA_VISITA + 
                           TO_NUMBER(TO_CHAR(:NEW.HORA_INICIO, 'HH24')) / 24) - SYSDATE) * 24;
    
    -- Validar mínimo 24 horas de anticipación
    IF v_horas_diferencia < 24 THEN
        RAISE_APPLICATION_ERROR(-20003, 
            'La reserva debe realizarse con al menos 24 horas de anticipación.');
    END IF;
END;
/

PROMPT Trigger TRG_VALIDAR_ANTICIPACION creado.

-- ============================================================================
-- TRIGGER: Validar máximo de recorridos por día del guía
-- ============================================================================
CREATE OR REPLACE TRIGGER TRG_VALIDAR_MAX_RECORRIDOS_GUIA
BEFORE INSERT ON ASIGNACION_GUIA
FOR EACH ROW
DECLARE
    v_recorridos_dia NUMBER;
    v_fecha_visita DATE;
BEGIN
    -- Obtener fecha de visita de la reserva
    SELECT FECHA_VISITA INTO v_fecha_visita
    FROM RESERVA
    WHERE ID_RESERVA = :NEW.ID_RESERVA;
    
    -- Contar recorridos del guía en esa fecha
    SELECT COUNT(*) INTO v_recorridos_dia
    FROM ASIGNACION_GUIA ag
    JOIN RESERVA r ON ag.ID_RESERVA = r.ID_RESERVA
    WHERE ag.ID_GUIA = :NEW.ID_GUIA
      AND r.FECHA_VISITA = v_fecha_visita;
    
    -- Validar máximo 2 recorridos por día
    IF v_recorridos_dia >= 2 THEN
        RAISE_APPLICATION_ERROR(-20004, 
            'El guía ya tiene el máximo de 2 recorridos asignados para esta fecha.');
    END IF;
END;
/

PROMPT Trigger TRG_VALIDAR_MAX_RECORRIDOS_GUIA creado.

-- ============================================================================
-- TRIGGER: Actualizar contador de visitas al completar reserva
-- ============================================================================
CREATE OR REPLACE TRIGGER TRG_INCREMENTAR_VISITAS
AFTER UPDATE OF ESTADO ON RESERVA
FOR EACH ROW
WHEN (NEW.ESTADO = 'COMPLETADA' AND OLD.ESTADO != 'COMPLETADA')
BEGIN
    UPDATE VISITANTE
    SET NUMERO_VISITAS = NUMERO_VISITAS + 1
    WHERE ID_USUARIO = :NEW.ID_VISITANTE;
END;
/

PROMPT Trigger TRG_INCREMENTAR_VISITAS creado.

-- ============================================================================
-- TRIGGER: Actualizar contador de recorridos del guía
-- ============================================================================
CREATE OR REPLACE TRIGGER TRG_INCREMENTAR_RECORRIDOS_GUIA
AFTER UPDATE OF HORA_FIN_REAL ON ASIGNACION_GUIA
FOR EACH ROW
WHEN (NEW.HORA_FIN_REAL IS NOT NULL AND OLD.HORA_FIN_REAL IS NULL)
BEGIN
    UPDATE GUIA
    SET NUMERO_RECORRIDOS = NUMERO_RECORRIDOS + 1
    WHERE ID_USUARIO = :NEW.ID_GUIA;
END;
/

PROMPT Trigger TRG_INCREMENTAR_RECORRIDOS_GUIA creado.

PROMPT ============================================================
PROMPT Todos los triggers creados exitosamente.
PROMPT ============================================================
