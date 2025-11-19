package com.uptc.bases2.demo.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(name = "horario_disponible")
public class HorarioDisponible {
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_horario_disponible")
    @SequenceGenerator(name = "seq_horario_disponible", sequenceName = "seq_horario_disponible", allocationSize = 1)
    @Column(name = "id_horario")
    private Long idHorario;
    
    @ManyToOne
    @JoinColumn(name = "id_sendero", nullable = false)
    private Sendero sendero;
    
    @Column(name = "hora_inicio", nullable = false, length = 5)
    private String horaInicio;
    
    @Column(name = "hora_fin", nullable = false, length = 5)
    private String horaFin;
    
    @Column(name = "cupo_horario")
    private Integer cupoHorario;
    
    @Column(name = "dias_semana", length = 20)
    private String diasSemana; // L,M,MI,J,V,S,D

    // Constructores
    public HorarioDisponible() {
        this.diasSemana = "L,M,MI,J,V,S,D";
    }
    
    public HorarioDisponible(Sendero sendero, String horaInicio, String horaFin, Integer cupoHorario) {
        this();
        this.sendero = sendero;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.cupoHorario = cupoHorario;
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

    public String getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(String horaInicio) {
        this.horaInicio = horaInicio;
    }

    public String getHoraFin() {
        return horaFin;
    }

    public void setHoraFin(String horaFin) {
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

    @Override
    public String toString() {
        return "HorarioDisponible{" +
                "idHorario=" + idHorario +
                ", horaInicio='" + horaInicio + '\'' +
                ", horaFin='" + horaFin + '\'' +
                ", cupoHorario=" + cupoHorario +
                '}';
    }
}