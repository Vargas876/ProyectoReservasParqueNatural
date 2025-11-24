package com.uptc.bases2.demo.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.uptc.bases2.demo.exceptions.ErrorResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

/**
 * Maneja errores de autenticación (401 Unauthorized)
 * Se ejecuta cuando un usuario no autenticado intenta acceder a un endpoint protegido
 */
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationEntryPoint.class);

    @Override
    public void commence(HttpServletRequest request, 
                        HttpServletResponse response,
                        AuthenticationException authException) 
            throws IOException, ServletException {
        
        logger.error("Error de autenticación: {}", authException.getMessage());
        
        // Configurar respuesta HTTP
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        
        // Crear objeto de error personalizado
        ErrorResponse errorResponse = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpServletResponse.SC_UNAUTHORIZED)
            .error("Unauthorized")
            .message("Acceso denegado. Token JWT inválido, expirado o no proporcionado")
            .path(request.getRequestURI())
            .build();
        
        // Escribir respuesta JSON
        ObjectMapper mapper = new ObjectMapper();
        mapper.findAndRegisterModules(); // Para serializar LocalDateTime
        mapper.writeValue(response.getOutputStream(), errorResponse);
    }
}
