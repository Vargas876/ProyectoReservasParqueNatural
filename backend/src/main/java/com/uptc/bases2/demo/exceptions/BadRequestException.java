package com.uptc.bases2.demo.exceptions;

/**
 * Excepción para peticiones mal formadas o datos inválidos (400)
 */
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }

    public BadRequestException(String message, Throwable cause) {
        super(message, cause);
    }
}
