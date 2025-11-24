package com.uptc.bases2.demo.models.entities;

import com.uptc.bases2.demo.models.enums.EstadoGeneral;
import com.uptc.bases2.demo.models.enums.Rol;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

/**
 * Entidad base para todos los usuarios del sistema (VISITANTE, GUIA, ADMIN)
 * Tabla unificada para autenticación y autorización
 */
@Entity
@Table(name = "USUARIO")
@Inheritance(strategy = InheritanceType.JOINED) // Herencia con tablas separadas
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "usuario_seq")
    @SequenceGenerator(name = "usuario_seq", sequenceName = "SEQ_USUARIO", allocationSize = 1)
    @Column(name = "ID_USUARIO")
    private Long id;

    @NotBlank(message = "La cédula es obligatoria")
    @Size(max = 20)
    @Column(name = "CEDULA", unique = true, nullable = false, length = 20)
    private String cedula;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100)
    @Column(name = "NOMBRE", nullable = false, length = 100)
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio")
    @Size(max = 100)
    @Column(name = "APELLIDO", nullable = false, length = 100)
    private String apellido;

    @Size(max = 15)
    @Column(name = "TELEFONO", length = 15)
    private String telefono;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Email inválido")
    @Size(max = 100)
    @Column(name = "EMAIL", unique = true, nullable = false, length = 100)
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    @Column(name = "PASSWORD", nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "ROL", nullable = false, length = 20)
    private Rol rol;

    @Enumerated(EnumType.STRING)
    @Column(name = "ESTADO", nullable = false, length = 20)
    private EstadoGeneral estado;

    @Column(name = "FECHA_REGISTRO")
    private LocalDateTime fechaRegistro;

    @Column(name = "FECHA_ULTIMA_MODIFICACION")
    private LocalDateTime fechaUltimaModificacion;

    // Constructores
    public Usuario() {
        this.estado = EstadoGeneral.ACTIVO;
        this.fechaRegistro = LocalDateTime.now();
        this.fechaUltimaModificacion = LocalDateTime.now();
    }

    public Usuario(String cedula, String nombre, String apellido, String telefono, 
                   String email, String password, Rol rol) {
        this();
        this.cedula = cedula;
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.email = email;
        this.password = password;
        this.rol = rol;
    }

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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
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

    public LocalDateTime getFechaUltimaModificacion() {
        return fechaUltimaModificacion;
    }

    public void setFechaUltimaModificacion(LocalDateTime fechaUltimaModificacion) {
        this.fechaUltimaModificacion = fechaUltimaModificacion;
    }

    // Callbacks JPA
    @PrePersist
    protected void onCreate() {
        if (fechaRegistro == null) {
            fechaRegistro = LocalDateTime.now();
        }
        if (fechaUltimaModificacion == null) {
            fechaUltimaModificacion = LocalDateTime.now();
        }
        if (estado == null) {
            estado = EstadoGeneral.ACTIVO;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        fechaUltimaModificacion = LocalDateTime.now();
    }

    // Métodos de utilidad
    public String getNombreCompleto() {
        return nombre + " " + apellido;
    }

    public boolean estaActivo() {
        return estado == EstadoGeneral.ACTIVO;
    }
}
