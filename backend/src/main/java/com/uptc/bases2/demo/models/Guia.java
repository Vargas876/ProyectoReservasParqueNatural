package com.uptc.bases2.demo.models;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(name = "guia")
public class Guia {
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_guia")
    @SequenceGenerator(name = "seq_guia", sequenceName = "seq_guia", allocationSize = 1)
    @Column(name = "id_guia")
    private Long idGuia;
    
    @Column(name = "cedula", nullable = false, unique = true, length = 20)
    private String cedula;
    
    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;
    
    @Column(name = "apellido", nullable = false, length = 100)
    private String apellido;
    
    @Column(name = "telefono", length = 15)
    private String telefono;
    
    @Column(name = "email", length = 100)
    private String email;
    
    @Column(name = "especialidades", length = 200)
    private String especialidades;
    
    @Column(name = "max_personas_grupo")
    private Integer maxPersonasGrupo;
    
    @Column(name = "estado", length = 10)
    private String estado; // ACTIVO, INACTIVO
    
    @Column(name = "fecha_ingreso")
    private LocalDate fechaIngreso;
    
    @OneToMany(mappedBy = "guia", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<AsignacionGuia> asignaciones;

    // Constructores
    public Guia() {
        this.fechaIngreso = LocalDate.now();
        this.estado = "ACTIVO";
        this.maxPersonasGrupo = 15;
    }
    
    public Guia(String cedula, String nombre, String apellido, String telefono, 
                String email, String especialidades) {
        this();
        this.cedula = cedula;
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.email = email;
        this.especialidades = especialidades;
    }

    // Getters y Setters
    public Long getIdGuia() {
        return idGuia;
    }

    public void setIdGuia(Long idGuia) {
        this.idGuia = idGuia;
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

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public LocalDate getFechaIngreso() {
        return fechaIngreso;
    }

    public void setFechaIngreso(LocalDate fechaIngreso) {
        this.fechaIngreso = fechaIngreso;
    }

    public List<AsignacionGuia> getAsignaciones() {
        return asignaciones;
    }

    public void setAsignaciones(List<AsignacionGuia> asignaciones) {
        this.asignaciones = asignaciones;
    }

    @Override
    public String toString() {
        return "Guia{" +
                "idGuia=" + idGuia +
                ", cedula='" + cedula + '\'' +
                ", nombre='" + nombre + '\'' +
                ", apellido='" + apellido + '\'' +
                ", especialidades='" + especialidades + '\'' +
                ", estado='" + estado + '\'' +
                '}';
    }
}