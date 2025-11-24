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

/**
 * Entidad que extiende Usuario específicamente para visitantes
 * Tabla: VISITANTE
 */
@Entity
@Table(name = "VISITANTE")
@PrimaryKeyJoinColumn(name = "ID_USUARIO")
public class Visitante extends Usuario {

    @Column(name = "NUMERO_VISITAS")
    private Integer numeroVisitas = 0;

    @Column(name = "PUNTUACION_PROMEDIO", columnDefinition = "NUMBER")
    private Double puntuacionPromedio = 0.0;

    // Relación con Reservas
    @OneToMany(mappedBy = "visitante", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Reserva> reservas = new ArrayList<>();

    // Constructores
    public Visitante() {
        super();
        setRol(Rol.VISITANTE);
    }

    public Visitante(String cedula, String nombre, String apellido, String telefono,
            String email, String password) {
        super(cedula, nombre, apellido, telefono, email, password, Rol.VISITANTE);
        this.numeroVisitas = 0;
        this.puntuacionPromedio = 0.0;
    }

    // Getters y Setters
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

    public List<Reserva> getReservas() {
        return reservas;
    }

    public void setReservas(List<Reserva> reservas) {
        this.reservas = reservas;
    }

    // Métodos de utilidad
    public void incrementarVisitas() {
        this.numeroVisitas++;
    }

    public int getReservasActivas() {
        return (int) reservas.stream()
                .filter(r -> r.getEstado().estaActiva())
                .count();
    }

    public boolean puedeHacerReserva() {
        return getReservasActivas() < 2; // Máximo 2 reservas activas
    }
}
