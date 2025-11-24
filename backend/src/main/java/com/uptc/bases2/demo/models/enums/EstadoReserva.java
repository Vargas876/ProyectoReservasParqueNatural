package com.uptc.bases2.demo.models.enums;

/**
 * Estados posibles de una reserva en el sistema
 */
public enum EstadoReserva {
    PENDIENTE("Pendiente", "Reserva creada, esperando confirmación"),
    CONFIRMADA("Confirmada", "Reserva confirmada por el sistema"),
    CANCELADA("Cancelada", "Reserva cancelada por el visitante o administrador"),
    COMPLETADA("Completada", "Visita realizada exitosamente"),
    NO_ASISTIO("No Asistió", "El visitante no se presentó a la visita");

    private final String displayName;
    private final String descripcion;

    EstadoReserva(String displayName, String descripcion) {
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
     * Convierte un String a EstadoReserva
     */
    public static EstadoReserva fromString(String estado) {
        if (estado == null) {
            return PENDIENTE;
        }
        
        for (EstadoReserva e : EstadoReserva.values()) {
            if (e.name().equalsIgnoreCase(estado) || 
                e.displayName.equalsIgnoreCase(estado)) {
                return e;
            }
        }
        
        throw new IllegalArgumentException("Estado de reserva inválido: " + estado);
    }

    /**
     * Verifica si la reserva puede ser modificada
     */
    public boolean puedeModificarse() {
        return this == PENDIENTE || this == CONFIRMADA;
    }

    /**
     * Verifica si la reserva puede ser cancelada
     */
    public boolean puedeCancelarse() {
        return this == PENDIENTE || this == CONFIRMADA;
    }

    /**
     * Verifica si la reserva está activa
     */
    public boolean estaActiva() {
        return this == PENDIENTE || this == CONFIRMADA;
    }
}
