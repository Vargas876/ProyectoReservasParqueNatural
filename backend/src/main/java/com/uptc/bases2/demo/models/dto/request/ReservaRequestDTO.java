package com.uptc.bases2.demo.models.dto.request;

import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * DTO para crear reservas
 */
public class ReservaRequestDTO {

    @NotNull(message = "El ID del sendero es obligatorio")
    private Long idSendero;

    @NotNull(message = "La fecha de visita es obligatoria")
    @Future(message = "La fecha de visita debe ser futura")
    private LocalDate fechaVisita;

    @NotNull(message = "El número de personas es obligatorio")
    @Min(value = 1, message = "Debe haber al menos 1 persona")
    @Max(value = 20, message = "Máximo 20 personas por reserva")
    private Integer numeroPersonas;

    @NotNull(message = "La hora de inicio es obligatoria")
    private LocalTime horaInicio;

    @Size(max = 500, message = "Las observaciones no pueden exceder 500 caracteres")
    private String observaciones;

    // Constructores
    public ReservaRequestDTO() {}

    // Getters y Setters
    public Long getIdSendero() {
        return idSendero;
    }

    public void setIdSendero(Long idSendero) {
        this.idSendero = idSendero;
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

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
}
