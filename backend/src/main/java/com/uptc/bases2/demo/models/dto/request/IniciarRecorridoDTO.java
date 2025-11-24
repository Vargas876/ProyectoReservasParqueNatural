package com.uptc.bases2.demo.models.dto.request;

import jakarta.validation.constraints.*;

/**
 * DTO para que el guía inicie un recorrido
 */
public class IniciarRecorridoDTO {

    @NotNull(message = "El ID de la asignación es obligatorio")
    private Long idAsignacion;

    @Size(max = 500, message = "Las observaciones no pueden exceder 500 caracteres")
    private String observacionesInicio;

    // Constructores
    public IniciarRecorridoDTO() {}

    // Getters y Setters
    public Long getIdAsignacion() {
        return idAsignacion;
    }

    public void setIdAsignacion(Long idAsignacion) {
        this.idAsignacion = idAsignacion;
    }

    public String getObservacionesInicio() {
        return observacionesInicio;
    }

    public void setObservacionesInicio(String observacionesInicio) {
        this.observacionesInicio = observacionesInicio;
    }
}
