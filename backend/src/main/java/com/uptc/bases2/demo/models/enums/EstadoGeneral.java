package com.uptc.bases2.demo.models.enums;

/**
 * Estados generales aplicables a múltiples entidades
 * (Visitante, Sendero, Guia, etc.)
 */
public enum EstadoGeneral {
    ACTIVO("Activo", "Entidad habilitada y funcional"),
    INACTIVO("Inactivo", "Entidad deshabilitada temporalmente"),
    BLOQUEADO("Bloqueado", "Entidad bloqueada por incumplimientos"),
    ELIMINADO("Eliminado", "Entidad eliminada lógicamente");

    private final String displayName;
    private final String descripcion;

    EstadoGeneral(String displayName, String descripcion) {
        this.displayName = displayName;
        this.descripcion = descripcion;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescripcion() {
        return descripcion;
    }

    /**
     * Convierte un String a EstadoGeneral
     */
    public static EstadoGeneral fromString(String estado) {
        if (estado == null) {
            return ACTIVO;
        }
        
        for (EstadoGeneral e : EstadoGeneral.values()) {
            if (e.name().equalsIgnoreCase(estado) || 
                e.displayName.equalsIgnoreCase(estado)) {
                return e;
            }
        }
        
        throw new IllegalArgumentException("Estado general inválido: " + estado);
    }

    /**
     * Verifica si la entidad está operativa
     */
    public boolean estaOperativo() {
        return this == ACTIVO;
    }

    /**
     * Verifica si la entidad puede ser reactivada
     */
    public boolean puedeReactivarse() {
        return this == INACTIVO || this == BLOQUEADO;
    }
}
