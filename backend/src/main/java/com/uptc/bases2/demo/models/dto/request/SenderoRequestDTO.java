package com.uptc.bases2.demo.models.dto.request;

import com.uptc.bases2.demo.models.enums.Dificultad;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

/**
 * DTO para crear/actualizar senderos
 */
public class SenderoRequestDTO {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    private String nombre;

    @Size(max = 2000, message = "La descripción no puede exceder 2000 caracteres")
    private String descripcion;

    @NotNull(message = "La dificultad es obligatoria")
    private Dificultad dificultad;

    @NotNull(message = "La duración es obligatoria")
    @DecimalMin(value = "0.1", message = "La duración debe ser mayor a 0")
    @DecimalMax(value = "24.0", message = "La duración no puede exceder 24 horas")
    private BigDecimal duracionHoras;

    @NotNull(message = "El cupo máximo es obligatorio")
    @Min(value = 1, message = "El cupo debe ser al menos 1")
    @Max(value = 100, message = "El cupo no puede exceder 100 personas")
    private Integer cupoMaximoDia;

    @NotNull(message = "La distancia es obligatoria")
    @DecimalMin(value = "0.01", message = "La distancia debe ser mayor a 0")
    @DecimalMax(value = "50.00", message = "La distancia no puede exceder 50 km")
    private BigDecimal distanciaKm;

    @Size(max = 500, message = "La URL de imagen no puede exceder 500 caracteres")
    private String imagenUrl;

    // Constructores
    public SenderoRequestDTO() {}

    // Getters y Setters
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

    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }
}
