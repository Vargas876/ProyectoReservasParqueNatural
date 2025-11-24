package com.uptc.bases2.demo.models.enums;

import java.time.DayOfWeek;
import java.util.Arrays;
import java.util.List;

/**
 * Días de la semana en español
 * Útil para configuración de horarios disponibles
 */
public enum DiaSemana {
    LUNES("Lunes", "L", DayOfWeek.MONDAY, 1),
    MARTES("Martes", "M", DayOfWeek.TUESDAY, 2),
    MIERCOLES("Miércoles", "MI", DayOfWeek.WEDNESDAY, 3),
    JUEVES("Jueves", "J", DayOfWeek.THURSDAY, 4),
    VIERNES("Viernes", "V", DayOfWeek.FRIDAY, 5),
    SABADO("Sábado", "S", DayOfWeek.SATURDAY, 6),
    DOMINGO("Domingo", "D", DayOfWeek.SUNDAY, 7);

    private final String displayName;
    private final String abreviatura;
    private final DayOfWeek dayOfWeek;
    private final int orden;

    DiaSemana(String displayName, String abreviatura, DayOfWeek dayOfWeek, int orden) {
        this.displayName = displayName;
        this.abreviatura = abreviatura;
        this.dayOfWeek = dayOfWeek;
        this.orden = orden;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getAbreviatura() {
        return abreviatura;
    }

    public DayOfWeek getDayOfWeek() {
        return dayOfWeek;
    }

    public int getOrden() {
        return orden;
    }

    /**
     * Convierte un DayOfWeek de Java a DiaSemana
     */
    public static DiaSemana fromDayOfWeek(DayOfWeek dayOfWeek) {
        for (DiaSemana d : DiaSemana.values()) {
            if (d.dayOfWeek == dayOfWeek) {
                return d;
            }
        }
        throw new IllegalArgumentException("DayOfWeek inválido: " + dayOfWeek);
    }

    /**
     * Convierte abreviatura a DiaSemana
     */
    public static DiaSemana fromAbreviatura(String abreviatura) {
        if (abreviatura == null) {
            return null;
        }

        for (DiaSemana d : DiaSemana.values()) {
            if (d.abreviatura.equalsIgnoreCase(abreviatura)) {
                return d;
            }
        }

        throw new IllegalArgumentException("Abreviatura de día inválida: " + abreviatura);
    }

    /**
     * Verifica si es fin de semana
     */
    public boolean esFinDeSemana() {
        return this == SABADO || this == DOMINGO;
    }

    /**
     * Verifica si es día laborable
     */
    public boolean esLaborable() {
        return !esFinDeSemana();
    }

    /**
     * Parsea string de días separados por coma (ej: "L,M,MI,J,V")
     */
    public static List<DiaSemana> parseListaDias(String diasString) {
        if (diasString == null || diasString.trim().isEmpty()) {
            return Arrays.asList(values()); // Todos los días
        }

        return Arrays.stream(diasString.split(","))
                .map(String::trim)
                .map(DiaSemana::fromAbreviatura)
                .toList();
    }
}
