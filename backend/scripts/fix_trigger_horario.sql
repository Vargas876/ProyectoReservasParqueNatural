-- Script para corregir el trigger de validación de horarios
-- Hace que el trigger sea más flexible: solo valida si hay horarios definidos

CREATE OR REPLACE TRIGGER TRG_VALIDAR_HORARIO
BEFORE INSERT OR UPDATE OF HORA_INICIO, ID_SENDERO ON RESERVA
FOR EACH ROW
DECLARE
    v_horario_valido NUMBER;
    v_dia_semana VARCHAR2(20);
    v_tiene_horarios NUMBER;
BEGIN
    IF :NEW.ESTADO IN ('PENDIENTE', 'CONFIRMADA') AND :NEW.HORA_INICIO IS NOT NULL THEN
        -- Obtener día de la semana
        SELECT UPPER(TO_CHAR(:NEW.FECHA_VISITA, 'DAY', 'NLS_DATE_LANGUAGE=SPANISH'))
        INTO v_dia_semana
        FROM DUAL;
        
        v_dia_semana := TRIM(v_dia_semana);
        
        -- Verificar si hay horarios definidos para este sendero
        SELECT COUNT(*)
        INTO v_tiene_horarios
        FROM HORARIO_DISPONIBLE
        WHERE ID_SENDERO = :NEW.ID_SENDERO
          AND ESTADO = 'ACTIVO';
        
        -- Solo validar si hay horarios definidos para el sendero
        IF v_tiene_horarios > 0 THEN
            -- Verificar si existe horario disponible para el día y hora específicos
            SELECT COUNT(*)
            INTO v_horario_valido
            FROM HORARIO_DISPONIBLE
            WHERE ID_SENDERO = :NEW.ID_SENDERO
              AND DIA_SEMANA = v_dia_semana
              AND :NEW.HORA_INICIO >= HORA_INICIO
              AND :NEW.HORA_INICIO < HORA_FIN
              AND ESTADO = 'ACTIVO';
            
            -- Si hay horarios definidos pero ninguno coincide, rechazar
            IF v_horario_valido = 0 THEN
                RAISE_APPLICATION_ERROR(-20004, 
                    'La hora ' || :NEW.HORA_INICIO || ' no está disponible para este sendero el día ' || v_dia_semana);
            END IF;
        END IF;
        -- Si no hay horarios definidos, permitir cualquier hora (no validar)
    END IF;
END;
/

