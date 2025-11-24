package com.uptc.bases2.demo.models.dto.request;

import jakarta.validation.constraints.*;

/**
 * DTO para asignar un guía a una reserva
 */
public class AsignacionGuiaRequestDTO {

    @NotNull(message = "El ID de la reserva es obligatorio")
    private Long idReserva;

    @NotNull(message = "El ID del guía es obligatorio")
    private Long idGuia;

    @Size(max = 500, message = "Las observaciones no pueden exceder 500 caracteres")
    private String observaciones;

    // Constructores
    public AsignacionGuiaRequestDTO() {}

    public AsignacionGuiaRequestDTO(Long idReserva, Long idGuia) {
        this.idReserva = idReserva;
        this.idGuia = idGuia;
    }

    // Getters y Setters
    public Long getIdReserva() {
        return idReserva;
    }

    public void setIdReserva(Long idReserva) {
        this.idReserva = idReserva;
    }

    public Long getIdGuia() {
        return idGuia;
    }

    public void setIdGuia(Long idGuia) {
        this.idGuia = idGuia;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
}
