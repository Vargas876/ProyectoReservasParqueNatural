package com.uptc.bases2.demo.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/")
public class HomeController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Sistema de Reservas - Parque Natural API");
        response.put("version", "1.0.0");
        response.put("status", "running");
        response.put("endpoints", Map.of(
            "senderos", "/api/sendero",
            "reservas", "/api/reserva",
            "visitantes", "/api/visitante",
            "guias", "/api/guia",
            "horarios", "/api/horario",
            "asignaciones", "/api/asignacion",
            "swagger", "/api/swagger-ui.html",
            "api-docs", "/api/api-docs"
        ));
        return ResponseEntity.ok(response);
    }
}

