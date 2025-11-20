package com.uptc.bases2.demo.models;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(name = "asignacion_guia")
public class AsignacionGuia {
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_asignacion_guia")
    @SequenceGenerator(name = "seq_asignacion_guia", sequenceName = "seq_asignacion_guia", allocationSize = 1)
    @Column(name = "id_asignacion")
    private Long idAsignacion;
    
    @OneToOne
    @JoinColumn(name = "id_reserva", nullable = false, unique = true)
    @JsonIgnoreProperties("asignacion") // Evita referencia circular
    private Reserva reserva;
    
    @ManyToOne(fetch = FetchType.EAGER) // Asegurar que carga el guía
    @JoinColumn(name = "id_guia", nullable = false)
    @JsonIgnoreProperties({"asignaciones", "hibernateLazyInitializer", "handler"}) // Evita problemas de serialización
    private Guia guia;
    
    @Column(name = "fecha_asignacion")
    private LocalDate fechaAsignacion;
    
    @Column(name = "hora_inicio_real")
    private LocalDateTime horaInicioReal;
    
    @Column(name = "hora_fin_real")
    private LocalDateTime horaFinReal;
    
    @Column(name = "observaciones_guia", length = 500)
    private String observacionesGuia;

    // Constructores
    public AsignacionGuia() {
        this.fechaAsignacion = LocalDate.now();
    }
    
    public AsignacionGuia(Reserva reserva, Guia guia) {
        this();
        this.reserva = reserva;
        this.guia = guia;
    }

    // Getters y Setters (sin cambios)
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

    @Override
    public String toString() {
        return "AsignacionGuia{" +
                "idAsignacion=" + idAsignacion +
                ", fechaAsignacion=" + fechaAsignacion +
                '}';
    }
}