package com.uptc.bases2.demo.models.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * DTO para crear/actualizar guías
 */
public class GuiaRequestDTO {

    @NotBlank(message = "La cédula es obligatoria")
    @Size(max = 20)
    private String cedula;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100)
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio")
    @Size(max = 100)
    private String apellido;

    @Size(max = 15)
    @Pattern(regexp = "^[0-9+\\-\\s()]*$", message = "Teléfono inválido")
    private String telefono;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Email inválido")
    @Size(max = 100)
    private String email;

    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    private String password;

    @Size(max = 200, message = "Las especialidades no pueden exceder 200 caracteres")
    private String especialidades;

    @Min(value = 1, message = "El máximo de personas debe ser al menos 1")
    @Max(value = 30, message = "El máximo de personas no puede exceder 30")
    private Integer maxPersonasGrupo;

    // Constructores
    public GuiaRequestDTO() {
    }

    // Getters y Setters
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
}
