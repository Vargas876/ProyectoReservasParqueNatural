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
@Table(name = "HORARIO_DISPONIBLE")
public class HorarioDisponible {
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_horario")
    @SequenceGenerator(name = "seq_horario", sequenceName = "SEQ_HORARIO", allocationSize = 1)
    @Column(name = "ID_HORARIO")
    private Long idHorario;
    
    @ManyToOne
    @JoinColumn(name = "ID_SENDERO", nullable = false)
    private Sendero sendero;
    
    @Column(name = "DIA_SEMANA", length = 20)
    private String diaSemana;
    
    @Column(name = "HORA_INICIO", nullable = false, length = 5)
    private String horaInicio;
    
    @Column(name = "HORA_FIN", nullable = false, length = 5)
    private String horaFin;
    
    // ⬇️ AQUÍ ESTÁ EL CAMBIO IMPORTANTE
    @Column(name = "CUPO_POR_HORARIO")  // ← Cambiar de "CUPO_HORARIO" a "CUPO_POR_HORARIO"
    private Integer cupoPorHorario;
    
    @Column(name = "ESTADO", length = 20)
    private String estado;

    // Constructores
    public HorarioDisponible() {
        this.estado = "ACTIVO";
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

    public String getDiaSemana() {
        return diaSemana;
    }

    public void setDiaSemana(String diaSemana) {
        this.diaSemana = diaSemana;
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

    public Integer getCupoPorHorario() {
        return cupoPorHorario;
    }

    public void setCupoPorHorario(Integer cupoPorHorario) {
        this.cupoPorHorario = cupoPorHorario;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    @Override
    public String toString() {
        return "HorarioDisponible{" +
                "idHorario=" + idHorario +
                ", diaSemana='" + diaSemana + '\'' +
                ", horaInicio='" + horaInicio + '\'' +
                ", horaFin='" + horaFin + '\'' +
                ", estado='" + estado + '\'' +
                '}';
    }
}