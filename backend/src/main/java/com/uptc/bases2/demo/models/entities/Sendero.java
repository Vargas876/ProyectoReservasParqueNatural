package com.uptc.bases2.demo.models.entities;

import com.uptc.bases2.demo.models.enums.Dificultad;
import com.uptc.bases2.demo.models.enums.EstadoGeneral;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidad Sendero - representa los senderos del parque
 * Tabla: SENDERO
 */
@Entity
@Table(name = "SENDERO")
public class Sendero {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sendero_seq")
    @SequenceGenerator(name = "sendero_seq", sequenceName = "SEQ_SENDERO", allocationSize = 1)
    @Column(name = "ID_SENDERO")
    private Long idSendero;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100)
    @Column(name = "NOMBRE", nullable = false, length = 100, unique = true)
    private String nombre;

    @Lob
    @Column(name = "DESCRIPCION", columnDefinition = "CLOB")
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(name = "DIFICULTAD", nullable = false, length = 20)
    private Dificultad dificultad;

    @NotNull(message = "La duración es obligatoria")
    @DecimalMin(value = "0.1", message = "La duración debe ser mayor a 0")
    @Column(name = "DURACION_HORAS", precision = 3, scale = 1)
    private BigDecimal duracionHoras;

    @NotNull(message = "El cupo máximo es obligatorio")
    @Min(value = 1, message = "El cupo debe ser al menos 1")
    @Column(name = "CUPO_MAXIMO_DIA", nullable = false)
    private Integer cupoMaximoDia;

    @NotNull(message = "La distancia es obligatoria")
    @DecimalMin(value = "0.01", message = "La distancia debe ser mayor a 0")
    @Column(name = "DISTANCIA_KM", precision = 5, scale = 2)
    private BigDecimal distanciaKm;

    @Enumerated(EnumType.STRING)
    @Column(name = "ESTADO", nullable = false, length = 20)
    private EstadoGeneral estado;

    @Column(name = "IMAGEN_URL", length = 500)
    private String imagenUrl;

    @Column(name = "FECHA_CREACION")
    private LocalDateTime fechaCreacion;

    @Column(name = "FECHA_MODIFICACION")
    private LocalDateTime fechaModificacion;

    // Relaciones
    @OneToMany(mappedBy = "sendero", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Reserva> reservas = new ArrayList<>();

    @OneToMany(mappedBy = "sendero", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<HorarioDisponible> horarios = new ArrayList<>();

    // Constructores
    public Sendero() {
        this.estado = EstadoGeneral.ACTIVO;
        this.fechaCreacion = LocalDateTime.now();
        this.fechaModificacion = LocalDateTime.now();
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

    // Callbacks
    @PrePersist
    protected void onCreate() {
        if (fechaCreacion == null) {
            fechaCreacion = LocalDateTime.now();
        }
        if (fechaModificacion == null) {
            fechaModificacion = LocalDateTime.now();
        }
        if (estado == null) {
            estado = EstadoGeneral.ACTIVO;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        fechaModificacion = LocalDateTime.now();
    }

    // Métodos de utilidad
    public boolean estaDisponible() {
        return estado == EstadoGeneral.ACTIVO;
    }

    public boolean requiereGuiaObligatorio() {
        return dificultad != null && dificultad.requiereGuia();
    }
}
