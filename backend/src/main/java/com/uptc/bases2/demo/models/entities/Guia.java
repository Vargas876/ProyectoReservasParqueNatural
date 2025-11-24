package com.uptc.bases2.demo.models.entities;

import java.util.ArrayList;
import java.util.List;

import com.uptc.bases2.demo.models.enums.Rol;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

/**
 * Entidad que extiende Usuario específicamente para guías
 * Tabla: GUIA
 */
@Entity
@Table(name = "GUIA")
@PrimaryKeyJoinColumn(name = "ID_USUARIO")
public class Guia extends Usuario {

    @Size(max = 200)
    @Column(name = "ESPECIALIDADES", length = 200)
    private String especialidades;

    @Min(value = 1, message = "El máximo de personas debe ser al menos 1")
    @Column(name = "MAX_PERSONAS_GRUPO")
    private Integer maxPersonasGrupo = 15;

    @Column(name = "CALIFICACION_PROMEDIO", columnDefinition = "NUMBER")
    private Double calificacionPromedio = 0.0;

    @Column(name = "NUMERO_RECORRIDOS")
    private Integer numeroRecorridos = 0;

    // Relación con Asignaciones
    @OneToMany(mappedBy = "guia", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AsignacionGuia> asignaciones = new ArrayList<>();

    // Constructores
    public Guia() {
        super();
        setRol(Rol.GUIA);
    }

    public Guia(String cedula, String nombre, String apellido, String telefono,
            String email, String password, String especialidades) {
        super(cedula, nombre, apellido, telefono, email, password, Rol.GUIA);
        this.especialidades = especialidades;
        this.maxPersonasGrupo = 15;
        this.calificacionPromedio = 0.0;
        this.numeroRecorridos = 0;
    }

    // Getters y Setters
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

    public List<AsignacionGuia> getAsignaciones() {
        return asignaciones;
    }

    public void setAsignaciones(List<AsignacionGuia> asignaciones) {
        this.asignaciones = asignaciones;
    }

    // Métodos de utilidad
    public void incrementarRecorridos() {
        this.numeroRecorridos++;
    }

    public boolean puedeTomarRecorrido(int numeroPersonas) {
        return numeroPersonas <= maxPersonasGrupo;
    }
}
