package com.uptc.bases2.demo.utils;

import java.util.regex.Pattern;

/**
 * Utilidades para validaciones comunes
 */
public class ValidationUtils {

    // Patrones de validación
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );
    
    private static final Pattern PHONE_PATTERN = Pattern.compile(
        "^[0-9+\\-\\s()]{7,15}$"
    );
    
    private static final Pattern CEDULA_PATTERN = Pattern.compile(
        "^[0-9]{6,20}$"
    );
    
    private static final Pattern PASSWORD_STRONG_PATTERN = Pattern.compile(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$"
    );

    /**
     * Validar formato de email
     */
    public static boolean esEmailValido(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }

    /**
     * Validar formato de teléfono
     */
    public static boolean esTelefonoValido(String telefono) {
        return telefono != null && PHONE_PATTERN.matcher(telefono).matches();
    }

    /**
     * Validar formato de cédula
     */
    public static boolean esCedulaValida(String cedula) {
        return cedula != null && CEDULA_PATTERN.matcher(cedula).matches();
    }

    /**
     * Validar contraseña fuerte
     * Al menos 8 caracteres, una mayúscula, una minúscula y un número
     */
    public static boolean esPasswordFuerte(String password) {
        return password != null && PASSWORD_STRONG_PATTERN.matcher(password).matches();
    }

    /**
     * Validar que un String no esté vacío
     */
    public static boolean noEstaVacio(String str) {
        return str != null && !str.trim().isEmpty();
    }

    /**
     * Validar rango numérico
     */
    public static boolean estaEnRango(Integer valor, int min, int max) {
        return valor != null && valor >= min && valor <= max;
    }

    /**
     * Validar rango numérico (double)
     */
    public static boolean estaEnRango(Double valor, double min, double max) {
        return valor != null && valor >= min && valor <= max;
    }

    /**
     * Sanitizar String (remover caracteres especiales)
     */
    public static String sanitizarString(String input) {
        if (input == null) {
            return null;
        }
        return input.trim().replaceAll("[<>\"']", "");
    }

    /**
     * Validar longitud de String
     */
    public static boolean longitudValida(String str, int minLength, int maxLength) {
        if (str == null) {
            return false;
        }
        int length = str.trim().length();
        return length >= minLength && length <= maxLength;
    }

    /**
     * Validar que contenga solo letras
     */
    public static boolean soloLetras(String str) {
        return str != null && str.matches("^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$");
    }

    /**
     * Validar que contenga solo números
     */
    public static boolean soloNumeros(String str) {
        return str != null && str.matches("^[0-9]+$");
    }

    /**
     * Capitalizar primera letra de cada palabra
     */
    public static String capitalizarPalabras(String str) {
        if (str == null || str.isEmpty()) {
            return str;
        }
        
        String[] palabras = str.split("\\s+");
        StringBuilder resultado = new StringBuilder();
        
        for (String palabra : palabras) {
            if (palabra.length() > 0) {
                resultado.append(Character.toUpperCase(palabra.charAt(0)))
                         .append(palabra.substring(1).toLowerCase())
                         .append(" ");
            }
        }
        
        return resultado.toString().trim();
    }

    /**
     * Generar código alfanumérico aleatorio
     */
    public static String generarCodigoAleatorio(int longitud) {
        String caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder codigo = new StringBuilder();
        
        for (int i = 0; i < longitud; i++) {
            int index = (int) (Math.random() * caracteres.length());
            codigo.append(caracteres.charAt(index));
        }
        
        return codigo.toString();
    }
}
