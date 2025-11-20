-- Script para corregir el problema de horarios disponibles
-- Opción 1: Hacer el trigger más flexible (solo valida si hay horarios definidos)

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

-- Opción 2: Crear horarios disponibles para todos los días y horas comunes
-- (Solo ejecutar si quieres tener horarios predefinidos para todos los senderos)

-- Insertar horarios para todos los días de la semana para cada sendero existente
-- Esto permite reservas de 06:00 a 17:00 todos los días

DECLARE
    v_sendero_id NUMBER;
    v_dias_semana VARCHAR2(200) := 'LUNES,MARTES,MIERCOLES,JUEVES,VIERNES,SABADO,DOMINGO';
    v_dia VARCHAR2(20);
    v_pos NUMBER := 1;
    v_next_pos NUMBER;
BEGIN
    -- Para cada sendero activo
    FOR sendero_rec IN (SELECT ID_SENDERO FROM SENDERO WHERE ESTADO = 'ACTIVO') LOOP
        v_sendero_id := sendero_rec.ID_SENDERO;
        
        -- Verificar si ya tiene horarios
        IF NOT EXISTS (
            SELECT 1 FROM HORARIO_DISPONIBLE 
            WHERE ID_SENDERO = v_sendero_id
        ) THEN
            -- Insertar horarios para cada día de la semana
            v_pos := 1;
            LOOP
                v_next_pos := INSTR(v_dias_semana, ',', v_pos);
                IF v_next_pos = 0 THEN
                    v_dia := SUBSTR(v_dias_semana, v_pos);
                ELSE
                    v_dia := SUBSTR(v_dias_semana, v_pos, v_next_pos - v_pos);
                    v_pos := v_next_pos + 1;
                END IF;
                
                -- Insertar horario de 06:00 a 17:00 para cada día
                INSERT INTO HORARIO_DISPONIBLE (ID_SENDERO, DIA_SEMANA, HORA_INICIO, HORA_FIN, CUPO_POR_HORARIO, ESTADO)
                VALUES (v_sendero_id, v_dia, '06:00', '17:00', 50, 'ACTIVO');
                
                EXIT WHEN v_next_pos = 0;
            END LOOP;
        END IF;
    END LOOP;
    
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Horarios disponibles creados exitosamente');
END;
/

