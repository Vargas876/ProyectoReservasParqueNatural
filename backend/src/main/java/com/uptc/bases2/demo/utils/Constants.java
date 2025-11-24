package com.uptc.bases2.demo.utils;

/**
 * Constantes de la aplicación
 */
public class Constants {

    // Reglas de negocio
    public static final int MAX_RESERVAS_ACTIVAS_POR_VISITANTE = 2;
    public static final int MAX_RECORRIDOS_POR_DIA_GUIA = 2;
    public static final long HORAS_MINIMAS_ANTICIPACION_RESERVA = 24;
    public static final int MAX_PERSONAS_POR_RESERVA = 20;
    public static final int MIN_PERSONAS_POR_RESERVA = 1;

    // Estados de reserva
    public static final String ESTADO_RESERVA_PENDIENTE = "PENDIENTE";
    public static final String ESTADO_RESERVA_CONFIRMADA = "CONFIRMADA";
    public static final String ESTADO_RESERVA_CANCELADA = "CANCELADA";
    public static final String ESTADO_RESERVA_COMPLETADA = "COMPLETADA";
    public static final String ESTADO_RESERVA_NO_ASISTIO = "NO_ASISTIO";

    // Estados generales
    public static final String ESTADO_ACTIVO = "ACTIVO";
    public static final String ESTADO_INACTIVO = "INACTIVO";
    public static final String ESTADO_BLOQUEADO = "BLOQUEADO";
    public static final String ESTADO_ELIMINADO = "ELIMINADO";

    // Roles
    public static final String ROL_ADMIN = "ADMIN";
    public static final String ROL_GUIA = "GUIA";
    public static final String ROL_VISITANTE = "VISITANTE";

    // Prefijo para roles de Spring Security
    public static final String ROLE_PREFIX = "ROLE_";

    // Dificultades de senderos
    public static final String DIFICULTAD_FACIL = "FACIL";
    public static final String DIFICULTAD_MODERADO = "MODERADO";
    public static final String DIFICULTAD_DIFICIL = "DIFICIL";
    public static final String DIFICULTAD_EXPERTO = "EXPERTO";

    // Mensajes de error comunes
    public static final String ERROR_RECURSO_NO_ENCONTRADO = "Recurso no encontrado";
    public static final String ERROR_DATOS_INVALIDOS = "Datos inválidos";
    public static final String ERROR_NO_AUTORIZADO = "No autorizado";
    public static final String ERROR_ACCESO_DENEGADO = "Acceso denegado";
    public static final String ERROR_CONFLICTO = "Conflicto con recurso existente";
    public static final String ERROR_INTERNO = "Error interno del servidor";

    // Códigos de reglas de negocio
    public static final String REGLA_MIN_24H = "MIN_24H_ANTICIPACION";
    public static final String REGLA_MAX_RESERVAS = "MAX_2_RESERVAS_ACTIVAS";
    public static final String REGLA_CUPO_INSUFICIENTE = "CUPO_INSUFICIENTE";
    public static final String REGLA_MAX_RECORRIDOS = "MAX_2_RECORRIDOS_DIA";
    public static final String REGLA_CAPACIDAD_GUIA = "CAPACIDAD_GUIA_EXCEDIDA";
    public static final String REGLA_HORARIO_SOLAPADO = "HORARIO_SOLAPADO";

    // Configuración de paginación
    public static final int PAGE_SIZE_DEFAULT = 20;
    public static final int PAGE_SIZE_MAX = 100;

    // Formatos de fecha
    public static final String FORMATO_FECHA = "dd/MM/yyyy";
    public static final String FORMATO_HORA = "HH:mm";
    public static final String FORMATO_FECHA_HORA = "dd/MM/yyyy HH:mm";

    // Timezone
    public static final String TIMEZONE = "America/Bogota";

    private Constants() {
        // Prevenir instanciación
        throw new IllegalStateException("Clase de utilidades - no instanciar");
    }
}
