package com.uptc.bases2.demo.models.dto.response;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * DTO para mostrar la agenda diaria del guía
 */
public class AgendaGuiaResponseDTO {

    private LocalDate fecha;
    private List<?> recorridos; // Puede ser List<RecorridoAgendaDTO> o List<AsignacionResponseDTO>
    private Integer totalRecorridos;
    private Integer recorridosPendientes;
    private Integer recorridosCompletados;

    // Constructores
    public AgendaGuiaResponseDTO() {
    }

    // Getters y Setters
    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public List<?> getRecorridos() {
        return recorridos;
    }

    public void setRecorridos(List<?> recorridos) {
        this.recorridos = recorridos;
    }

    public Integer getTotalRecorridos() {
        return totalRecorridos;
    }

    public void setTotalRecorridos(Integer totalRecorridos) {
        this.totalRecorridos = totalRecorridos;
    }

    public Integer getRecorridosPendientes() {
        return recorridosPendientes;
    }

    public void setRecorridosPendientes(Integer recorridosPendientes) {
        this.recorridosPendientes = recorridosPendientes;
    }

    public Integer getRecorridosCompletados() {
        return recorridosCompletados;
    }

    public void setRecorridosCompletados(Integer recorridosCompletados) {
        this.recorridosCompletados = recorridosCompletados;
    }

    // Clase interna para detalles de cada recorrido
    public static class RecorridoAgendaDTO {
        private Long idAsignacion;
        private Long idReserva;
        private String nombreSendero;
        private LocalTime horaInicio;
        private Integer numeroPersonas;
        private String estadoReserva;
        private String nombreVisitante;
        private String telefonoVisitante;

        // Getters y Setters
        public Long getIdAsignacion() {
            return idAsignacion;
        }

        public void setIdAsignacion(Long idAsignacion) {
            this.idAsignacion = idAsignacion;
        }

        public Long getIdReserva() {
            return idReserva;
        }

        public void setIdReserva(Long idReserva) {
            this.idReserva = idReserva;
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

        public Integer getNumeroPersonas() {
            return numeroPersonas;
        }

        public void setNumeroPersonas(Integer numeroPersonas) {
            this.numeroPersonas = numeroPersonas;
        }

        public String getEstadoReserva() {
            return estadoReserva;
        }

        public void setEstadoReserva(String estadoReserva) {
            this.estadoReserva = estadoReserva;
        }

        public String getNombreVisitante() {
            return nombreVisitante;
        }

        public void setNombreVisitante(String nombreVisitante) {
            this.nombreVisitante = nombreVisitante;
        }

        public String getTelefonoVisitante() {
            return telefonoVisitante;
        }

        public void setTelefonoVisitante(String telefonoVisitante) {
            this.telefonoVisitante = telefonoVisitante;
        }
    }
}
