package com.uptc.bases2.demo.models.dto.response;

import com.uptc.bases2.demo.models.enums.EstadoGeneral;
import java.time.LocalDateTime;

/**
 * DTO de respuesta para visitantes
 */
public class VisitanteResponseDTO {

    private Long id;
    private String cedula;
    private String nombre;
    private String apellido;
    private String telefono;
    private String email;
    private EstadoGeneral estado;
    private Integer numeroVisitas;
    private Double puntuacionPromedio;
    private LocalDateTime fechaRegistro;

    // Constructores
    public VisitanteResponseDTO() {}

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCedula() {
        return cedula;
    }

    public void setCedula(String cedula) {
        this.cedula = cedula;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public EstadoGeneral getEstado() {
        return estado;
    }

    public void setEstado(EstadoGeneral estado) {
        this.estado = estado;
    }

    public Integer getNumeroVisitas() {
        return numeroVisitas;
    }

    public void setNumeroVisitas(Integer numeroVisitas) {
        this.numeroVisitas = numeroVisitas;
    }

    public Double getPuntuacionPromedio() {
        return puntuacionPromedio;
    }

    public void setPuntuacionPromedio(Double puntuacionPromedio) {
        this.puntuacionPromedio = puntuacionPromedio;
    }

    public LocalDateTime getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(LocalDateTime fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

    // Método auxiliar
    public String getNombreCompleto() {
        return nombre + " " + apellido;
    }
}
