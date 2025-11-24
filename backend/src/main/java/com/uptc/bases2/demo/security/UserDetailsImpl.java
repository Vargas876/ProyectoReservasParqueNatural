package com.uptc.bases2.demo.security;

import java.util.Collection;
import java.util.Collections;
import java.util.Objects;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.uptc.bases2.demo.models.entities.Usuario;

/**
 * Implementación de UserDetails de Spring Security
 * Representa al usuario autenticado en el contexto de seguridad
 */
public class UserDetailsImpl implements UserDetails {

    private static final long serialVersionUID = 1L;

    private Long id;
    private String email;
    private String nombre;
    private String apellido;

    @JsonIgnore
    private String password;

    private String rol;
    private String estado;

    private Collection<? extends GrantedAuthority> authorities;

    // Constructor completo
    public UserDetailsImpl(Long id, String email, String nombre, String apellido,
            String password, String rol, String estado,
            Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.email = email;
        this.nombre = nombre;
        this.apellido = apellido;
        this.password = password;
        this.rol = rol;
        this.estado = estado;
        this.authorities = authorities;
    }

    /**
     * Constructor estático para crear UserDetailsImpl desde Usuario
     */
    public static UserDetailsImpl build(Usuario usuario) {
        // Convertir rol enum a GrantedAuthority con prefijo ROLE_
        String roleWithPrefix = usuario.getRol().getSpringSecurityRole();

        GrantedAuthority authority = new SimpleGrantedAuthority(roleWithPrefix);

        return new UserDetailsImpl(
                usuario.getId(),
                usuario.getEmail(),
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getPassword(),
                usuario.getRol().name(), // Convertir enum a String
                usuario.getEstado().name(), // Convertir enum a String
                Collections.singletonList(authority));
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getNombre() {
        return nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public String getRol() {
        return rol;
    }

    public String getEstado() {
        return estado;
    }

    // Implementación de UserDetails
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email; // Usamos email como username
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return "ACTIVO".equals(estado);
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return "ACTIVO".equals(estado);
    }

    /**
     * Método auxiliar para obtener el nombre completo
     */
    public String getNombreCompleto() {
        return nombre + " " + apellido;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        UserDetailsImpl that = (UserDetailsImpl) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
