package com.uptc.bases2.demo.exceptions;

/**
 * Excepción para conflictos de recursos (409)
 * Ej: Email duplicado, cédula duplicada, etc.
 */
public class ConflictException extends RuntimeException {

    public ConflictException(String message) {
        super(message);
    }

    public ConflictException(String message, Throwable cause) {
        super(message, cause);
    }
}
