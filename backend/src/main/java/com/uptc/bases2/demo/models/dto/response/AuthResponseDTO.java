package com.uptc.bases2.demo.models.dto.response;

/**
 * DTO de respuesta para autenticación exitosa
 */
public class AuthResponseDTO {

    private String token;
    private String tipo = "Bearer";
    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private String rol;

    // Constructores
    public AuthResponseDTO() {}

    public AuthResponseDTO(String token, Long id, String nombre, String apellido, 
                          String email, String rol) {
        this.token = token;
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.rol = rol;
    }

    // Getters y Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }
}
