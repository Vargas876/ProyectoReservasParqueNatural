package com.uptc.bases2.demo.models.dto.response;

import com.uptc.bases2.demo.models.enums.Dificultad;
import com.uptc.bases2.demo.models.enums.EstadoGeneral;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO de respuesta para senderos
 */
public class SenderoResponseDTO {

    private Long idSendero;
    private String nombre;
    private String descripcion;
    private Dificultad dificultad;
    private BigDecimal duracionHoras;
    private Integer cupoMaximoDia;
    private BigDecimal distanciaKm;
    private EstadoGeneral estado;
    private String imagenUrl;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaModificacion;

    // Constructores
    public SenderoResponseDTO() {}

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

    public Dificultad getDificultad() {
        return dificultad;
    }

    public void setDificultad(Dificultad dificultad) {
        this.dificultad = dificultad;
    }

    public BigDecimal getDuracionHoras() {
        return duracionHoras;
    }

    public void setDuracionHoras(BigDecimal duracionHoras) {
        this.duracionHoras = duracionHoras;
    }

    public Integer getCupoMaximoDia() {
        return cupoMaximoDia;
    }

    public void setCupoMaximoDia(Integer cupoMaximoDia) {
        this.cupoMaximoDia = cupoMaximoDia;
    }

    public BigDecimal getDistanciaKm() {
        return distanciaKm;
    }

    public void setDistanciaKm(BigDecimal distanciaKm) {
        this.distanciaKm = distanciaKm;
    }

    public EstadoGeneral getEstado() {
        return estado;
    }

    public void setEstado(EstadoGeneral estado) {
        this.estado = estado;
    }

    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public LocalDateTime getFechaModificacion() {
        return fechaModificacion;
    }

    public void setFechaModificacion(LocalDateTime fechaModificacion) {
        this.fechaModificacion = fechaModificacion;
    }
}
