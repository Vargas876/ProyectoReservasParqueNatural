package com.uptc.bases2.demo.utils;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

/**
 * Utilidades para manejo de fechas y tiempos
 */
public class DateUtils {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");
    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    /**
     * Formatear LocalDate a String (dd/MM/yyyy)
     */
    public static String formatearFecha(LocalDate fecha) {
        return fecha != null ? fecha.format(DATE_FORMATTER) : null;
    }

    /**
     * Formatear LocalTime a String (HH:mm)
     */
    public static String formatearHora(LocalTime hora) {
        return hora != null ? hora.format(TIME_FORMATTER) : null;
    }

    /**
     * Formatear LocalDateTime a String (dd/MM/yyyy HH:mm)
     */
    public static String formatearFechaHora(LocalDateTime fechaHora) {
        return fechaHora != null ? fechaHora.format(DATETIME_FORMATTER) : null;
    }

    /**
     * Parsear String a LocalDate (formato: dd/MM/yyyy)
     */
    public static LocalDate parsearFecha(String fechaStr) {
        try {
            return LocalDate.parse(fechaStr, DATE_FORMATTER);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Parsear String a LocalTime (formato: HH:mm)
     */
    public static LocalTime parsearHora(String horaStr) {
        try {
            return LocalTime.parse(horaStr, TIME_FORMATTER);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Calcular diferencia en días entre dos fechas
     */
    public static long calcularDiasEntre(LocalDate fechaInicio, LocalDate fechaFin) {
        return ChronoUnit.DAYS.between(fechaInicio, fechaFin);
    }

    /**
     * Calcular diferencia en horas entre dos fechas
     */
    public static long calcularHorasEntre(LocalDateTime inicio, LocalDateTime fin) {
        return ChronoUnit.HOURS.between(inicio, fin);
    }

    /**
     * Calcular diferencia en minutos entre dos tiempos
     */
    public static long calcularMinutosEntre(LocalTime inicio, LocalTime fin) {
        return ChronoUnit.MINUTES.between(inicio, fin);
    }

    /**
     * Verificar si una fecha es futura (después de hoy)
     */
    public static boolean esFechaFutura(LocalDate fecha) {
        return fecha.isAfter(LocalDate.now());
    }

    /**
     * Verificar si una fecha es pasada (antes de hoy)
     */
    public static boolean esFechaPasada(LocalDate fecha) {
        return fecha.isBefore(LocalDate.now());
    }

    /**
     * Verificar si una fecha es hoy
     */
    public static boolean esHoy(LocalDate fecha) {
        return fecha.equals(LocalDate.now());
    }

    /**
     * Obtener el día de la semana en español
     */
    public static String obtenerDiaSemanaEspanol(LocalDate fecha) {
        DayOfWeek dia = fecha.getDayOfWeek();
        switch (dia) {
            case MONDAY: return "Lunes";
            case TUESDAY: return "Martes";
            case WEDNESDAY: return "Miércoles";
            case THURSDAY: return "Jueves";
            case FRIDAY: return "Viernes";
            case SATURDAY: return "Sábado";
            case SUNDAY: return "Domingo";
            default: return "";
        }
    }

    /**
     * Obtener abreviatura del día de la semana
     */
    public static String obtenerAbreviaturaDia(LocalDate fecha) {
        DayOfWeek dia = fecha.getDayOfWeek();
        switch (dia) {
            case MONDAY: return "L";
            case TUESDAY: return "M";
            case WEDNESDAY: return "MI";
            case THURSDAY: return "J";
            case FRIDAY: return "V";
            case SATURDAY: return "S";
            case SUNDAY: return "D";
            default: return "";
        }
    }

    /**
     * Verificar si una fecha está dentro de un rango
     */
    public static boolean estaEnRango(LocalDate fecha, LocalDate inicio, LocalDate fin) {
        return !fecha.isBefore(inicio) && !fecha.isAfter(fin);
    }

    /**
     * Agregar días a una fecha
     */
    public static LocalDate agregarDias(LocalDate fecha, long dias) {
        return fecha.plusDays(dias);
    }

    /**
     * Restar días a una fecha
     */
    public static LocalDate restarDias(LocalDate fecha, long dias) {
        return fecha.minusDays(dias);
    }

    /**
     * Obtener la fecha de mañana
     */
    public static LocalDate obtenerManana() {
        return LocalDate.now().plusDays(1);
    }

    /**
     * Obtener la fecha de ayer
     */
    public static LocalDate obtenerAyer() {
        return LocalDate.now().minusDays(1);
    }

    /**
     * Verificar si es fin de semana
     */
    public static boolean esFinDeSemana(LocalDate fecha) {
        DayOfWeek dia = fecha.getDayOfWeek();
        return dia == DayOfWeek.SATURDAY || dia == DayOfWeek.SUNDAY;
    }

    /**
     * Verificar si la diferencia entre dos fechas es mayor a X horas
     */
    public static boolean diferenciaEnHorasMayorA(LocalDate fecha1, LocalDate fecha2, long horas) {
        long horasDiferencia = ChronoUnit.HOURS.between(
            fecha1.atStartOfDay(), 
            fecha2.atStartOfDay()
        );
        return Math.abs(horasDiferencia) > horas;
    }

    /**
     * Convertir LocalDate a epoch millis (timestamp)
     */
    public static long toEpochMilli(LocalDate fecha) {
        return fecha.atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli();
    }

    /**
     * Convertir epoch millis a LocalDate
     */
    public static LocalDate fromEpochMilli(long epochMilli) {
        return Instant.ofEpochMilli(epochMilli)
            .atZone(ZoneId.systemDefault())
            .toLocalDate();
    }
}
