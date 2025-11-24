package com.uptc.bases2.demo.exceptions;

/**
 * Excepción para problemas de autenticación (401)
 */
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }

    public UnauthorizedException(String message, Throwable cause) {
        super(message, cause);
    }
}
