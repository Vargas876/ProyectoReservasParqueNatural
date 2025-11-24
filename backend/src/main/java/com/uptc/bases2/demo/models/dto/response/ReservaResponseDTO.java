package com.uptc.bases2.demo.models.dto.response;

import com.uptc.bases2.demo.models.enums.EstadoReserva;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * DTO de respuesta para reservas
 */
public class ReservaResponseDTO {

    private Long idReserva;
    private VisitanteResponseDTO visitante;
    private SenderoResponseDTO sendero;
    private LocalDateTime fechaReserva;
    private LocalDate fechaVisita;
    private Integer numeroPersonas;
    private LocalTime horaInicio;
    private EstadoReserva estado;
    private String observaciones;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaModificacion;
    private LocalDateTime fechaCancelacion;
    private String motivoCancelacion;
    private Boolean tieneGuiaAsignado;
    private GuiaResponseDTO guiaAsignado;

    // Constructores
    public ReservaResponseDTO() {}

    // Getters y Setters
    public Long getIdReserva() {
        return idReserva;
    }

    public void setIdReserva(Long idReserva) {
        this.idReserva = idReserva;
    }

    public VisitanteResponseDTO getVisitante() {
        return visitante;
    }

    public void setVisitante(VisitanteResponseDTO visitante) {
        this.visitante = visitante;
    }

    public SenderoResponseDTO getSendero() {
        return sendero;
    }

    public void setSendero(SenderoResponseDTO sendero) {
        this.sendero = sendero;
    }

    public LocalDateTime getFechaReserva() {
        return fechaReserva;
    }

    public void setFechaReserva(LocalDateTime fechaReserva) {
        this.fechaReserva = fechaReserva;
    }

    public LocalDate getFechaVisita() {
        return fechaVisita;
    }

    public void setFechaVisita(LocalDate fechaVisita) {
        this.fechaVisita = fechaVisita;
    }

    public Integer getNumeroPersonas() {
        return numeroPersonas;
    }

    public void setNumeroPersonas(Integer numeroPersonas) {
        this.numeroPersonas = numeroPersonas;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public EstadoReserva getEstado() {
        return estado;
    }

    public void setEstado(EstadoReserva estado) {
        this.estado = estado;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public LocalDateTime getFechaModificacion() {
        return fechaModificacion;
    }

    public void setFechaModificacion(LocalDateTime fechaModificacion) {
        this.fechaModificacion = fechaModificacion;
    }

    public LocalDateTime getFechaCancelacion() {
        return fechaCancelacion;
    }

    public void setFechaCancelacion(LocalDateTime fechaCancelacion) {
        this.fechaCancelacion = fechaCancelacion;
    }

    public String getMotivoCancelacion() {
        return motivoCancelacion;
    }

    public void setMotivoCancelacion(String motivoCancelacion) {
        this.motivoCancelacion = motivoCancelacion;
    }

    public Boolean getTieneGuiaAsignado() {
        return tieneGuiaAsignado;
    }

    public void setTieneGuiaAsignado(Boolean tieneGuiaAsignado) {
        this.tieneGuiaAsignado = tieneGuiaAsignado;
    }

    public GuiaResponseDTO getGuiaAsignado() {
        return guiaAsignado;
    }

    public void setGuiaAsignado(GuiaResponseDTO guiaAsignado) {
        this.guiaAsignado = guiaAsignado;
    }
}
