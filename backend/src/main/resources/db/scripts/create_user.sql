-- ============================================================================
-- Script: create_user.sql (ORACLE XE - PDB)
-- Descripción: Crear usuario y otorgar permisos en Oracle XE 21c
-- ============================================================================

-- Conectar como SYSDBA
-- sqlplus sys/password@localhost:1521/XE as sysdba

-- Cambiar al Pluggable Database
ALTER SESSION SET CONTAINER = XEPDB1;

PROMPT Creando usuario en XEPDB1...

-- Crear usuario
CREATE USER parque_natural_user IDENTIFIED BY Parque123;

-- Otorgar permisos necesarios
GRANT CONNECT TO parque_natural_user;
GRANT RESOURCE TO parque_natural_user;
GRANT CREATE SESSION TO parque_natural_user;
GRANT CREATE TABLE TO parque_natural_user;
GRANT CREATE VIEW TO parque_natural_user;
GRANT CREATE SEQUENCE TO parque_natural_user;
GRANT CREATE TRIGGER TO parque_natural_user;
GRANT CREATE PROCEDURE TO parque_natural_user;

-- Otorgar cuota ilimitada en tablespace
ALTER USER parque_natural_user QUOTA UNLIMITED ON USERS;

-- Verificar creación
SELECT username, account_status, default_tablespace, created
FROM dba_users 
WHERE username = 'PARQUE_NATURAL_USER';

PROMPT Usuario creado exitosamente en XEPDB1.
PROMPT 
PROMPT Conexión para usar: parque_natural_user/Parque123@localhost:1521/XEPDB1
