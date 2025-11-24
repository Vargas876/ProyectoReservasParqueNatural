package com.uptc.bases2.demo.models.enums;

import java.util.Arrays;
import java.util.List;

/**
 * Roles de usuario en el sistema
 */
public enum Rol {
    VISITANTE("Visitante", "Usuario que realiza reservas", 
              Arrays.asList("VER_SENDEROS", "CREAR_RESERVA", "VER_MIS_RESERVAS", "CANCELAR_RESERVA")),
    
    GUIA("Guía", "Personal que guía los recorridos", 
         Arrays.asList("VER_AGENDA", "CONFIRMAR_DISPONIBILIDAD", "INICIAR_RECORRIDO", "FINALIZAR_RECORRIDO")),
    
    ADMIN("Administrador", "Administrador del sistema", 
          Arrays.asList("GESTIONAR_SENDEROS", "GESTIONAR_GUIAS", "GESTIONAR_HORARIOS", 
                       "ASIGNAR_GUIAS", "VER_REPORTES", "GESTIONAR_USUARIOS"));

    private final String displayName;
    private final String descripcion;
    private final List<String> permisos;

    Rol(String displayName, String descripcion, List<String> permisos) {
        this.displayName = displayName;
        this.descripcion = descripcion;
        this.permisos = permisos;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public List<String> getPermisos() {
        return permisos;
    }

    /**
     * Convierte un String a Rol
     */
    public static Rol fromString(String rol) {
        if (rol == null) {
            return VISITANTE;
        }
        
        // Remover prefijo ROLE_ si existe
        String cleanRol = rol.replace("ROLE_", "");
        
        for (Rol r : Rol.values()) {
            if (r.name().equalsIgnoreCase(cleanRol) || 
                r.displayName.equalsIgnoreCase(cleanRol)) {
                return r;
            }
        }
        
        throw new IllegalArgumentException("Rol inválido: " + rol);
    }

    /**
     * Obtiene el nombre del rol con prefijo ROLE_ para Spring Security
     */
    public String getSpringSecurityRole() {
        return "ROLE_" + this.name();
    }

    /**
     * Verifica si el rol tiene un permiso específico
     */
    public boolean tienePermiso(String permiso) {
        return permisos.contains(permiso);
    }

    /**
     * Verifica si es un rol administrativo
     */
    public boolean esAdministrativo() {
        return this == ADMIN;
    }

    /**
     * Verifica si puede gestionar reservas de otros usuarios
     */
    public boolean puedeGestionarReservas() {
        return this == ADMIN || this == GUIA;
    }
}
