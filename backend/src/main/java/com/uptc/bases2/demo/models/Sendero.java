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
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(name = "sendero")
public class Sendero {
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_sendero")
    @SequenceGenerator(name = "seq_sendero", sequenceName = "seq_sendero", allocationSize = 1)
    @Column(name = "id_sendero")
    private Long idSendero;
    
    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;
    
    @Lob
    @Column(name = "descripcion")
    private String descripcion;
    
    @Column(name = "dificultad", length = 20)
    private String dificultad; // FACIL, MODERADO, DIFICIL
    
    @Column(name = "duracion_horas")
    private Double duracionHoras;
    
    @Column(name = "cupo_maximo_dia")
    private Integer cupoMaximoDia;
    
    @Column(name = "distancia_km")
    private Double distanciaKm;
    
    @Column(name = "estado", length = 10)
    private String estado; // ACTIVO, INACTIVO
    
    @Column(name = "fecha_creacion")
    private LocalDate fechaCreacion;
    
    @OneToMany(mappedBy = "sendero", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Reserva> reservas;
    
    @OneToMany(mappedBy = "sendero", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<HorarioDisponible> horarios;

    // Constructores
    public Sendero() {
        this.fechaCreacion = LocalDate.now();
        this.estado = "ACTIVO";
    }
    
    public Sendero(String nombre, String descripcion, String dificultad, 
                   Double duracionHoras, Integer cupoMaximoDia, Double distanciaKm) {
        this();
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.dificultad = dificultad;
        this.duracionHoras = duracionHoras;
        this.cupoMaximoDia = cupoMaximoDia;
        this.distanciaKm = distanciaKm;
    }

    // Getters y Setters
    public Long getIdSendero() {
        return idSendero;
    }

    public void setIdSendero(Long idSendero) {
        this.idSendero = idSendero;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDificultad() {
        return dificultad;
    }

    public void setDificultad(String dificultad) {
        this.dificultad = dificultad;
    }

    public Double getDuracionHoras() {
        return duracionHoras;
    }

    public void setDuracionHoras(Double duracionHoras) {
        this.duracionHoras = duracionHoras;
    }

    public Integer getCupoMaximoDia() {
        return cupoMaximoDia;
    }

    public void setCupoMaximoDia(Integer cupoMaximoDia) {
        this.cupoMaximoDia = cupoMaximoDia;
    }

    public Double getDistanciaKm() {
        return distanciaKm;
    }

    public void setDistanciaKm(Double distanciaKm) {
        this.distanciaKm = distanciaKm;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public LocalDate getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDate fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public List<Reserva> getReservas() {
        return reservas;
    }

    public void setReservas(List<Reserva> reservas) {
        this.reservas = reservas;
    }

    public List<HorarioDisponible> getHorarios() {
        return horarios;
    }

    public void setHorarios(List<HorarioDisponible> horarios) {
        this.horarios = horarios;
    }

    @Override
    public String toString() {
        return "Sendero{" +
                "idSendero=" + idSendero +
                ", nombre='" + nombre + '\'' +
                ", dificultad='" + dificultad + '\'' +
                ", duracionHoras=" + duracionHoras +
                ", cupoMaximoDia=" + cupoMaximoDia +
                ", estado='" + estado + '\'' +
                '}';
    }
}