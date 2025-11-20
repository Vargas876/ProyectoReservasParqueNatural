package com.uptc.bases2.demo.models;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
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
@Table(name = "reserva")
public class Reserva {
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_reserva")
    @SequenceGenerator(name = "seq_reserva", sequenceName = "seq_reserva", allocationSize = 1)
    @Column(name = "id_reserva")
    private Long idReserva;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_visitante", nullable = false)
    @JsonIgnoreProperties({"reservas", "hibernateLazyInitializer", "handler"})
    private Visitante visitante;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_sendero", nullable = false)
    @JsonIgnoreProperties({"reservas", "horarios", "hibernateLazyInitializer", "handler"})
    private Sendero sendero;
    
    @Column(name = "fecha_reserva", nullable = false)
    private LocalDate fechaReserva;
    
    @Column(name = "fecha_visita", nullable = false)
    private LocalDate fechaVisita;
    
    @Column(name = "numero_personas", nullable = false)
    private Integer numeroPersonas;
    
    @Column(name = "hora_inicio", length = 5)
    private String horaInicio;
    
    @Column(name = "estado", length = 20)
    private String estado;
    
    @Column(name = "observaciones", length = 500)
    private String observaciones;
    
    @Column(name = "fecha_creacion")
    private LocalDate fechaCreacion;
    
    @Column(name = "fecha_modificacion")
    private LocalDate fechaModificacion;
    
    @OneToOne(mappedBy = "reserva", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    // ⬆️ QUITÉ @JsonIgnore y agregué fetch = FetchType.EAGER
    private AsignacionGuia asignacion;

    // Constructores
    public Reserva() {
        this.fechaReserva = LocalDate.now();
        this.fechaCreacion = LocalDate.now();
        this.estado = "PENDIENTE";
        this.horaInicio = "08:00";
    }
    
    public Reserva(Visitante visitante, Sendero sendero, LocalDate fechaVisita, 
                   Integer numeroPersonas, String horaInicio) {
        this();
        this.visitante = visitante;
        this.sendero = sendero;
        this.fechaVisita = fechaVisita;
        this.numeroPersonas = numeroPersonas;
        this.horaInicio = horaInicio;
    }

    // Getters y Setters (sin cambios)
    public Long getIdReserva() {
        return idReserva;
    }

    public void setIdReserva(Long idReserva) {
        this.idReserva = idReserva;
    }

    public Visitante getVisitante() {
        return visitante;
    }

    public void setVisitante(Visitante visitante) {
        this.visitante = visitante;
    }

    public Sendero getSendero() {
        return sendero;
    }

    public void setSendero(Sendero sendero) {
        this.sendero = sendero;
    }

    public LocalDate getFechaReserva() {
        return fechaReserva;
    }

    public void setFechaReserva(LocalDate fechaReserva) {
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

    public String getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(String horaInicio) {
        this.horaInicio = horaInicio;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public LocalDate getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDate fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public LocalDate getFechaModificacion() {
        return fechaModificacion;
    }

    public void setFechaModificacion(LocalDate fechaModificacion) {
        this.fechaModificacion = fechaModificacion;
    }

    public AsignacionGuia getAsignacion() {
        return asignacion;
    }

    public void setAsignacion(AsignacionGuia asignacion) {
        this.asignacion = asignacion;
    }

    @Override
    public String toString() {
        return "Reserva{" +
                "idReserva=" + idReserva +
                ", fechaVisita=" + fechaVisita +
                ", numeroPersonas=" + numeroPersonas +
                ", estado='" + estado + '\'' +
                '}';
    }
}