package com.uptc.bases2.demo.models.dto.response;

import java.time.LocalTime;

/**
 * DTO de respuesta para horarios disponibles
 */
public class HorarioResponseDTO {

    private Long idHorario;
    private Long idSendero;
    private String nombreSendero;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private Integer cupoHorario;
    private String diasSemana;
    private Boolean activo;
    private Long duracionMinutos;

    // Constructores
    public HorarioResponseDTO() {}

    // Getters y Setters
    public Long getIdHorario() {
        return idHorario;
    }

    public void setIdHorario(Long idHorario) {
        this.idHorario = idHorario;
    }

    public Long getIdSendero() {
        return idSendero;
    }

    public void setIdSendero(Long idSendero) {
        this.idSendero = idSendero;
    }

    public String getNombreSendero() {
        return nombreSendero;
    }

    public void setNombreSendero(String nombreSendero) {
        this.nombreSendero = nombreSendero;
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

    public Long getDuracionMinutos() {
        return duracionMinutos;
    }

    public void setDuracionMinutos(Long duracionMinutos) {
        this.duracionMinutos = duracionMinutos;
    }
}
