package com.uptc.bases2.demo.models.entities;

import com.uptc.bases2.demo.models.enums.EstadoReserva;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * Entidad Reserva - representa las reservas de los visitantes
 * Tabla: RESERVA
 */
@Entity
@Table(name = "RESERVA", indexes = {
    @Index(name = "idx_reserva_visitante", columnList = "ID_VISITANTE"),
    @Index(name = "idx_reserva_sendero", columnList = "ID_SENDERO"),
    @Index(name = "idx_reserva_fecha", columnList = "FECHA_VISITA")
})
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "reserva_seq")
    @SequenceGenerator(name = "reserva_seq", sequenceName = "SEQ_RESERVA", allocationSize = 1)
    @Column(name = "ID_RESERVA")
    private Long idReserva;

    // Relación con Visitante (Many-to-One)
    @NotNull(message = "El visitante es obligatorio")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_VISITANTE", nullable = false, 
                foreignKey = @ForeignKey(name = "FK_RESERVA_VISITANTE"))
    private Visitante visitante;

    // Relación con Sendero (Many-to-One)
    @NotNull(message = "El sendero es obligatorio")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_SENDERO", nullable = false,
                foreignKey = @ForeignKey(name = "FK_RESERVA_SENDERO"))
    private Sendero sendero;

    @Column(name = "FECHA_RESERVA")
    private LocalDateTime fechaReserva;

    @NotNull(message = "La fecha de visita es obligatoria")
    @Future(message = "La fecha de visita debe ser futura")
    @Column(name = "FECHA_VISITA", nullable = false)
    private LocalDate fechaVisita;

    @NotNull(message = "El número de personas es obligatorio")
    @Min(value = 1, message = "Debe haber al menos 1 persona")
    @Max(value = 20, message = "Máximo 20 personas por reserva")
    @Column(name = "NUMERO_PERSONAS", nullable = false)
    private Integer numeroPersonas;

    @NotNull(message = "La hora de inicio es obligatoria")
    @Column(name = "HORA_INICIO", nullable = false)
    private LocalTime horaInicio;

    @Enumerated(EnumType.STRING)
    @Column(name = "ESTADO", nullable = false, length = 20)
    private EstadoReserva estado;

    @Size(max = 500)
    @Column(name = "OBSERVACIONES", length = 500)
    private String observaciones;

    @Column(name = "FECHA_CREACION")
    private LocalDateTime fechaCreacion;

    @Column(name = "FECHA_MODIFICACION")
    private LocalDateTime fechaModificacion;

    @Column(name = "FECHA_CANCELACION")
    private LocalDateTime fechaCancelacion;

    @Size(max = 200)
    @Column(name = "MOTIVO_CANCELACION", length = 200)
    private String motivoCancelacion;

    // Relación One-to-One con AsignacionGuia
    @OneToOne(mappedBy = "reserva", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private AsignacionGuia asignacionGuia;

    // Constructores
    public Reserva() {
        this.estado = EstadoReserva.PENDIENTE;
        this.fechaReserva = LocalDateTime.now();
        this.fechaCreacion = LocalDateTime.now();
        this.fechaModificacion = LocalDateTime.now();
    }

    // Getters y Setters
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

    public AsignacionGuia getAsignacionGuia() {
        return asignacionGuia;
    }

    public void setAsignacionGuia(AsignacionGuia asignacionGuia) {
        this.asignacionGuia = asignacionGuia;
    }

    // Callbacks JPA
    @PrePersist
    protected void onCreate() {
        if (fechaReserva == null) {
            fechaReserva = LocalDateTime.now();
        }
        if (fechaCreacion == null) {
            fechaCreacion = LocalDateTime.now();
        }
        if (fechaModificacion == null) {
            fechaModificacion = LocalDateTime.now();
        }
        if (estado == null) {
            estado = EstadoReserva.PENDIENTE;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        fechaModificacion = LocalDateTime.now();
    }

    // Métodos de utilidad
    public boolean puedeModificarse() {
        return estado != null && estado.puedeModificarse();
    }

    public boolean puedeCancelarse() {
        return estado != null && estado.puedeCancelarse();
    }

    public boolean estaActiva() {
        return estado != null && estado.estaActiva();
    }

    public boolean tieneGuiaAsignado() {
        return asignacionGuia != null;
    }

    public void cancelar(String motivo) {
        this.estado = EstadoReserva.CANCELADA;
        this.fechaCancelacion = LocalDateTime.now();
        this.motivoCancelacion = motivo;
    }

    public void confirmar() {
        this.estado = EstadoReserva.CONFIRMADA;
    }

    public void completar() {
        this.estado = EstadoReserva.COMPLETADA;
    }

    public void marcarNoAsistio() {
        this.estado = EstadoReserva.NO_ASISTIO;
    }
}
