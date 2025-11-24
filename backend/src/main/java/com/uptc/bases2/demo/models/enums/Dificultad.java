package com.uptc.bases2.demo.models.enums;

/**
 * Niveles de dificultad de los senderos
 */
public enum Dificultad {
    FACIL("Fácil", "Sendero apto para todo público, terreno plano", 1),
    MODERADO("Moderado", "Requiere condición física básica, algunas pendientes", 2),
    DIFICIL("Difícil", "Requiere buena condición física, terreno irregular", 3),
    EXPERTO("Experto", "Solo para personas con excelente condición física", 4);

    private final String displayName;
    private final String descripcion;
    private final int nivelDificultad;

    Dificultad(String displayName, String descripcion, int nivelDificultad) {
        this.displayName = displayName;
        this.descripcion = descripcion;
        this.nivelDificultad = nivelDificultad;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public int getNivelDificultad() {
        return nivelDificultad;
    }

    /**
     * Convierte un String a Dificultad
     */
    public static Dificultad fromString(String dificultad) {
        if (dificultad == null) {
            return FACIL;
        }
        
        for (Dificultad d : Dificultad.values()) {
            if (d.name().equalsIgnoreCase(dificultad) || 
                d.displayName.equalsIgnoreCase(dificultad)) {
                return d;
            }
        }
        
        throw new IllegalArgumentException("Dificultad inválida: " + dificultad);
    }

    /**
     * Obtiene la dificultad por nivel numérico
     */
    public static Dificultad fromNivel(int nivel) {
        for (Dificultad d : Dificultad.values()) {
            if (d.nivelDificultad == nivel) {
                return d;
            }
        }
        
        throw new IllegalArgumentException("Nivel de dificultad inválido: " + nivel);
    }

    /**
     * Verifica si requiere guía obligatorio
     */
    public boolean requiereGuia() {
        return this == DIFICIL || this == EXPERTO;
    }

    /**
     * Verifica si es apto para niños
     */
    public boolean aptoParaNinos() {
        return this == FACIL;
    }
}
