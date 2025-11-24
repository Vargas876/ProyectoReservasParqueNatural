package com.uptc.bases2.demo.models.dto.response;

import java.time.LocalDateTime;

/**
 * DTO genérico para respuestas de la API
 * Útil para operaciones exitosas sin datos específicos
 */
public class ApiResponseDTO<T> {

    private boolean success;
    private String message;
    private T data;
    private LocalDateTime timestamp;

    // Constructores
    public ApiResponseDTO() {
        this.timestamp = LocalDateTime.now();
    }

    public ApiResponseDTO(boolean success, String message) {
        this();
        this.success = success;
        this.message = message;
    }

    public ApiResponseDTO(boolean success, String message, T data) {
        this(success, message);
        this.data = data;
    }

    // Métodos estáticos para crear respuestas comunes
    public static <T> ApiResponseDTO<T> success(String message, T data) {
        return new ApiResponseDTO<>(true, message, data);
    }

    public static <T> ApiResponseDTO<T> success(String message) {
        return new ApiResponseDTO<>(true, message, null);
    }

    public static <T> ApiResponseDTO<T> error(String message) {
        return new ApiResponseDTO<>(false, message, null);
    }

    // Getters y Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
