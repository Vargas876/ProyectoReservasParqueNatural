package com.uptc.bases2.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Clase principal de la aplicación
 * Sistema de Reservas para Parque Natural
 * 
 * @author Equipo de Desarrollo - UPTC
 * @version 1.0.0
 */
@SpringBootApplication
@EnableAsync  // Habilita procesamiento asíncrono (para emails)
public class ParqueNaturalApplication {

    public static void main(String[] args) {
        SpringApplication.run(ParqueNaturalApplication.class, args);
        
        System.out.println("\n" +
            "╔════════════════════════════════════════════════════════════╗\n" +
            "║                                                            ║\n" +
            "║   Sistema de Reservas - Parque Natural                    ║\n" +
            "║   API REST con Spring Boot 3.x                            ║\n" +
            "║                                                            ║\n" +
            "║   Servidor: http://localhost:8081/api                     ║\n" +
            "║   Swagger UI: http://localhost:8081/api/swagger-ui.html   ║\n" +
            "║   API Docs: http://localhost:8081/api/v3/api-docs         ║\n" +
            "║                                                            ║\n" +
            "║   Estado: ✓ INICIADO CORRECTAMENTE                        ║\n" +
            "║                                                            ║\n" +
            "╚════════════════════════════════════════════════════════════╝\n"
        );
    }
}
