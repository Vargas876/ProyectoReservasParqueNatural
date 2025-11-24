package com.uptc.bases2.demo.models.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO de respuesta para asignaciones de guía
 */
public class AsignacionResponseDTO {

    private Long idAsignacion;
    private Long idReserva;
    private GuiaResponseDTO guia;
    private ReservaResponseDTO reserva; // AGREGADO: Incluir toda la info de la reserva
    private LocalDate fechaAsignacion;
    private LocalDateTime horaInicioReal;
    private LocalDateTime horaFinReal;
    private String observacionesGuia;
    private Integer calificacionVisitante;
    private String comentarioVisitante;
    private Boolean incidencias;
    private String descripcionIncidencias;
    private Long duracionMinutos;

    // Constructores
    public AsignacionResponseDTO() {
    }

    // Getters y Setters
    public Long getIdAsignacion() {
        return idAsignacion;
    }

    public void setIdAsignacion(Long idAsignacion) {
        this.idAsignacion = idAsignacion;
    }

    public Long getIdReserva() {
        return idReserva;
    }

    public void setIdReserva(Long idReserva) {
        this.idReserva = idReserva;
    }

    public GuiaResponseDTO getGuia() {
        return guia;
    }

    public void setGuia(GuiaResponseDTO guia) {
        this.guia = guia;
    }

    public ReservaResponseDTO getReserva() {
        return reserva;
    }

    public void setReserva(ReservaResponseDTO reserva) {
        this.reserva = reserva;
    }

    public LocalDate getFechaAsignacion() {
        return fechaAsignacion;
    }

    public void setFechaAsignacion(LocalDate fechaAsignacion) {
        this.fechaAsignacion = fechaAsignacion;
    }

    public LocalDateTime getHoraInicioReal() {
        return horaInicioReal;
    }

    public void setHoraInicioReal(LocalDateTime horaInicioReal) {
        this.horaInicioReal = horaInicioReal;
    }

    public LocalDateTime getHoraFinReal() {
        return horaFinReal;
    }

    public void setHoraFinReal(LocalDateTime horaFinReal) {
        this.horaFinReal = horaFinReal;
    }

    public String getObservacionesGuia() {
        return observacionesGuia;
    }

    public void setObservacionesGuia(String observacionesGuia) {
        this.observacionesGuia = observacionesGuia;
    }

    public Integer getCalificacionVisitante() {
        return calificacionVisitante;
    }

    public void setCalificacionVisitante(Integer calificacionVisitante) {
        this.calificacionVisitante = calificacionVisitante;
    }

    public String getComentarioVisitante() {
        return comentarioVisitante;
    }

    public void setComentarioVisitante(String comentarioVisitante) {
        this.comentarioVisitante = comentarioVisitante;
    }

    public Boolean getIncidencias() {
        return incidencias;
    }

    public void setIncidencias(Boolean incidencias) {
        this.incidencias = incidencias;
    }

    public String getDescripcionIncidencias() {
        return descripcionIncidencias;
    }

    public void setDescripcionIncidencias(String descripcionIncidencias) {
        this.descripcionIncidencias = descripcionIncidencias;
    }

    public Long getDuracionMinutos() {
        return duracionMinutos;
    }

    public void setDuracionMinutos(Long duracionMinutos) {
        this.duracionMinutos = duracionMinutos;
    }
}
