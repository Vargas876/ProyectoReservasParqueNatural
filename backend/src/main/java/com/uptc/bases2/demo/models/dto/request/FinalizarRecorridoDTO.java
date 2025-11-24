package com.uptc.bases2.demo.models.dto.request;

import jakarta.validation.constraints.*;

/**
 * DTO para que el guía finalice un recorrido
 */
public class FinalizarRecorridoDTO {

    @NotNull(message = "El ID de la asignación es obligatorio")
    private Long idAsignacion;

    @Size(max = 500, message = "Las observaciones no pueden exceder 500 caracteres")
    private String observacionesGuia;

    private Boolean huboIncidencias = false;

    @Size(max = 500, message = "La descripción de incidencias no puede exceder 500 caracteres")
    private String descripcionIncidencias;

    // Constructores
    public FinalizarRecorridoDTO() {}

    // Getters y Setters
    public Long getIdAsignacion() {
        return idAsignacion;
    }

    public void setIdAsignacion(Long idAsignacion) {
        this.idAsignacion = idAsignacion;
    }

    public String getObservacionesGuia() {
        return observacionesGuia;
    }

    public void setObservacionesGuia(String observacionesGuia) {
        this.observacionesGuia = observacionesGuia;
    }

    public Boolean getHuboIncidencias() {
        return huboIncidencias;
    }

    public void setHuboIncidencias(Boolean huboIncidencias) {
        this.huboIncidencias = huboIncidencias;
    }

    public String getDescripcionIncidencias() {
        return descripcionIncidencias;
    }

    public void setDescripcionIncidencias(String descripcionIncidencias) {
        this.descripcionIncidencias = descripcionIncidencias;
    }
}
