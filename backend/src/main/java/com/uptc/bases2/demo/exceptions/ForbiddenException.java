package com.uptc.bases2.demo.exceptions;

/**
 * Excepción personalizada para recursos prohibidos
 * HTTP 403 Forbidden
 */
public class ForbiddenException extends RuntimeException {
    public ForbiddenException(String mensaje) {
        super(mensaje);
    }

    public ForbiddenException(String mensaje, Throwable causa) {
        super(mensaje, causa);
    }
}
