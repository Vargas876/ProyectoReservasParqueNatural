package com.uptc.bases2.demo.models.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entidad AsignacionGuia - representa la asignación de un guía a una reserva
 * Tabla: ASIGNACION_GUIA
 */
@Entity
@Table(name = "ASIGNACION_GUIA", indexes = {
    @Index(name = "idx_asignacion_guia", columnList = "ID_GUIA"),
    @Index(name = "idx_asignacion_fecha", columnList = "FECHA_ASIGNACION")
})
public class AsignacionGuia {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "asignacion_seq")
    @SequenceGenerator(name = "asignacion_seq", sequenceName = "SEQ_ASIGNACION", allocationSize = 1)
    @Column(name = "ID_ASIGNACION")
    private Long idAsignacion;

    // Relación One-to-One con Reserva
    @NotNull(message = "La reserva es obligatoria")
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_RESERVA", unique = true, nullable = false,
                foreignKey = @ForeignKey(name = "FK_ASIGNACION_RESERVA"))
    private Reserva reserva;

    // Relación Many-to-One con Guia
    @NotNull(message = "El guía es obligatorio")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_GUIA", nullable = false,
                foreignKey = @ForeignKey(name = "FK_ASIGNACION_GUIA"))
    private Guia guia;

    @Column(name = "FECHA_ASIGNACION")
    private LocalDate fechaAsignacion;

    @Column(name = "HORA_INICIO_REAL")
    private LocalDateTime horaInicioReal;

    @Column(name = "HORA_FIN_REAL")
    private LocalDateTime horaFinReal;

    @Size(max = 500)
    @Column(name = "OBSERVACIONES_GUIA", length = 500)
    private String observacionesGuia;

    @Column(name = "CALIFICACION_VISITANTE")
    private Integer calificacionVisitante; // 1-5 estrellas

    @Size(max = 300)
    @Column(name = "COMENTARIO_VISITANTE", length = 300)
    private String comentarioVisitante;

    @Column(name = "INCIDENCIAS")
    private Boolean incidencias = false;

    @Size(max = 500)
    @Column(name = "DESCRIPCION_INCIDENCIAS", length = 500)
    private String descripcionIncidencias;

    // Constructores
    public AsignacionGuia() {
        this.fechaAsignacion = LocalDate.now();
        this.incidencias = false;
    }

    public AsignacionGuia(Reserva reserva, Guia guia) {
        this();
        this.reserva = reserva;
        this.guia = guia;
    }

    // Getters y Setters
    public Long getIdAsignacion() {
        return idAsignacion;
    }

    public void setIdAsignacion(Long idAsignacion) {
        this.idAsignacion = idAsignacion;
    }

    public Reserva getReserva() {
        return reserva;
    }

    public void setReserva(Reserva reserva) {
        this.reserva = reserva;
    }

    public Guia getGuia() {
        return guia;
    }

    public void setGuia(Guia guia) {
        this.guia = guia;
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

    // Callbacks JPA
    @PrePersist
    protected void onCreate() {
        if (fechaAsignacion == null) {
            fechaAsignacion = LocalDate.now();
        }
        if (incidencias == null) {
            incidencias = false;
        }
    }

    // Métodos de utilidad
    public void iniciarRecorrido() {
        this.horaInicioReal = LocalDateTime.now();
    }

    public void finalizarRecorrido(String observaciones) {
        this.horaFinReal = LocalDateTime.now();
        this.observacionesGuia = observaciones;
    }

    public boolean estaEnCurso() {
        return horaInicioReal != null && horaFinReal == null;
    }

    public boolean estaFinalizado() {
        return horaInicioReal != null && horaFinReal != null;
    }

    public Long getDuracionMinutos() {
        if (horaInicioReal != null && horaFinReal != null) {
            return java.time.Duration.between(horaInicioReal, horaFinReal).toMinutes();
        }
        return null;
    }
}
