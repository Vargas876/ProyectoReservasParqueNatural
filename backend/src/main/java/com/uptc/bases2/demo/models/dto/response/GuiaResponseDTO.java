package com.uptc.bases2.demo.models.dto.response;

import com.uptc.bases2.demo.models.enums.EstadoGeneral;
import java.time.LocalDateTime;

/**
 * DTO de respuesta para guías
 */
public class GuiaResponseDTO {

    private Long id;
    private String cedula;
    private String nombre;
    private String apellido;
    private String telefono;
    private String email;
    private String especialidades;
    private Integer maxPersonasGrupo;
    private Double calificacionPromedio;
    private Integer numeroRecorridos;
    private EstadoGeneral estado;
    private LocalDateTime fechaRegistro;

    // Constructores
    public GuiaResponseDTO() {}

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

    public String getEspecialidades() {
        return especialidades;
    }

    public void setEspecialidades(String especialidades) {
        this.especialidades = especialidades;
    }

    public Integer getMaxPersonasGrupo() {
        return maxPersonasGrupo;
    }

    public void setMaxPersonasGrupo(Integer maxPersonasGrupo) {
        this.maxPersonasGrupo = maxPersonasGrupo;
    }

    public Double getCalificacionPromedio() {
        return calificacionPromedio;
    }

    public void setCalificacionPromedio(Double calificacionPromedio) {
        this.calificacionPromedio = calificacionPromedio;
    }

    public Integer getNumeroRecorridos() {
        return numeroRecorridos;
    }

    public void setNumeroRecorridos(Integer numeroRecorridos) {
        this.numeroRecorridos = numeroRecorridos;
    }

    public EstadoGeneral getEstado() {
        return estado;
    }

    public void setEstado(EstadoGeneral estado) {
        this.estado = estado;
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
