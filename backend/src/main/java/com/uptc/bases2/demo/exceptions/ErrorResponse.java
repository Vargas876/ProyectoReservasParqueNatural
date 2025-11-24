package com.uptc.bases2.demo.exceptions;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * Estructura estandarizada para respuestas de error
 */
public class ErrorResponse {

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;

    private int status;
    private String error;
    private String message;
    private String path;
    private List<String> details;

    // Constructores
    public ErrorResponse() {
        this.timestamp = LocalDateTime.now();
        this.details = new ArrayList<>();
    }

    public ErrorResponse(int status, String error, String message, String path) {
        this();
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
    }

    // Builder pattern
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private ErrorResponse errorResponse = new ErrorResponse();

        public Builder timestamp(LocalDateTime timestamp) {
            errorResponse.timestamp = timestamp;
            return this;
        }

        public Builder status(int status) {
            errorResponse.status = status;
            return this;
        }

        public Builder error(String error) {
            errorResponse.error = error;
            return this;
        }

        public Builder message(String message) {
            errorResponse.message = message;
            return this;
        }

        public Builder path(String path) {
            errorResponse.path = path;
            return this;
        }

        public Builder details(List<String> details) {
            errorResponse.details = details;
            return this;
        }

        public Builder addDetail(String detail) {
            errorResponse.details.add(detail);
            return this;
        }

        public ErrorResponse build() {
            return errorResponse;
        }
    }

    // Getters y Setters
    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public List<String> getDetails() {
        return details;
    }

    public void setDetails(List<String> details) {
        this.details = details;
    }

    /**
     * Agrega un detalle a la lista de detalles
     */
    public void addDetail(String detail) {
        if (this.details == null) {
            this.details = new ArrayList<>();
        }
        this.details.add(detail);
    }
}
