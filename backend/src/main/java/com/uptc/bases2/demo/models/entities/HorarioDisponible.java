package com.uptc.bases2.demo.models.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalTime;

/**
 * Entidad HorarioDisponible - define los horarios disponibles por sendero
 * Tabla: HORARIO_DISPONIBLE
 */
@Entity
@Table(name = "HORARIO_DISPONIBLE", indexes = {
    @Index(name = "idx_horario_sendero", columnList = "ID_SENDERO")
})
public class HorarioDisponible {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "horario_seq")
    @SequenceGenerator(name = "horario_seq", sequenceName = "SEQ_HORARIO", allocationSize = 1)
    @Column(name = "ID_HORARIO")
    private Long idHorario;

    // Relación Many-to-One con Sendero
    @NotNull(message = "El sendero es obligatorio")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_SENDERO", nullable = false,
                foreignKey = @ForeignKey(name = "FK_HORARIO_SENDERO"))
    private Sendero sendero;

    @NotNull(message = "La hora de inicio es obligatoria")
    @Column(name = "HORA_INICIO", nullable = false)
    private LocalTime horaInicio;

    @NotNull(message = "La hora de fin es obligatoria")
    @Column(name = "HORA_FIN", nullable = false)
    private LocalTime horaFin;

    @NotNull(message = "El cupo del horario es obligatorio")
    @Min(value = 1, message = "El cupo debe ser al menos 1")
    @Column(name = "CUPO_HORARIO", nullable = false)
    private Integer cupoHorario;

    @Size(max = 50)
    @Column(name = "DIAS_SEMANA", length = 50)
    private String diasSemana; // Formato: "L,M,MI,J,V,S,D"

    @Column(name = "ACTIVO")
    private Boolean activo = true;

    // Constructores
    public HorarioDisponible() {
        this.activo = true;
        this.diasSemana = "L,M,MI,J,V,S,D"; // Todos los días por defecto
    }

    // Getters y Setters
    public Long getIdHorario() {
        return idHorario;
    }

    public void setIdHorario(Long idHorario) {
        this.idHorario = idHorario;
    }

    public Sendero getSendero() {
        return sendero;
    }

    public void setSendero(Sendero sendero) {
        this.sendero = sendero;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public LocalTime getHoraFin() {
        return horaFin;
    }

    public void setHoraFin(LocalTime horaFin) {
        this.horaFin = horaFin;
    }

    public Integer getCupoHorario() {
        return cupoHorario;
    }

    public void setCupoHorario(Integer cupoHorario) {
        this.cupoHorario = cupoHorario;
    }

    public String getDiasSemana() {
        return diasSemana;
    }

    public void setDiasSemana(String diasSemana) {
        this.diasSemana = diasSemana;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    // Callbacks JPA
    @PrePersist
    protected void onCreate() {
        if (activo == null) {
            activo = true;
        }
        if (diasSemana == null || diasSemana.isEmpty()) {
            diasSemana = "L,M,MI,J,V,S,D";
        }
    }

    // Métodos de utilidad
    public boolean estaDisponibleDia(String dia) {
        return diasSemana != null && diasSemana.contains(dia);
    }

    public boolean estaActivo() {
        return Boolean.TRUE.equals(activo);
    }

    public Long getDuracionMinutos() {
        if (horaInicio != null && horaFin != null) {
            return java.time.Duration.between(horaInicio, horaFin).toMinutes();
        }
        return null;
    }
}
