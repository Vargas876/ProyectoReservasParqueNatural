package com.uptc.bases2.demo.models.dto.request;

import jakarta.validation.constraints.*;
import java.time.LocalTime;

/**
 * DTO para crear/actualizar horarios disponibles
 */
public class HorarioRequestDTO {

    @NotNull(message = "El ID del sendero es obligatorio")
    private Long idSendero;

    @NotNull(message = "La hora de inicio es obligatoria")
    private LocalTime horaInicio;

    @NotNull(message = "La hora de fin es obligatoria")
    private LocalTime horaFin;

    @NotNull(message = "El cupo del horario es obligatorio")
    @Min(value = 1, message = "El cupo debe ser al menos 1")
    @Max(value = 50, message = "El cupo no puede exceder 50 personas")
    private Integer cupoHorario;

    @Size(max = 50, message = "Los días de semana no pueden exceder 50 caracteres")
    @Pattern(regexp = "^[LMIJVSD,]+$", message = "Formato de días inválido (usar L,M,MI,J,V,S,D)")
    private String diasSemana;

    // Constructores
    public HorarioRequestDTO() {}

    // Getters y Setters
    public Long getIdSendero() {
        return idSendero;
    }

    public void setIdSendero(Long idSendero) {
        this.idSendero = idSendero;
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
}
