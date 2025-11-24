package com.uptc.bases2.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uptc.bases2.demo.models.dto.request.AuthRequestDTO;
import com.uptc.bases2.demo.models.dto.request.GuiaRequestDTO;
import com.uptc.bases2.demo.models.dto.request.VisitanteRequestDTO;
import com.uptc.bases2.demo.models.dto.response.ApiResponseDTO;
import com.uptc.bases2.demo.models.dto.response.AuthResponseDTO;
import com.uptc.bases2.demo.services.interfaces.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

/**
 * Controlador para autenticación y registro
 */
@RestController
@RequestMapping("/auth")
@Tag(name = "Autenticación", description = "Endpoints para login y registro de usuarios")
public class AuthController {

    @Autowired
    private AuthService authService;
    @Autowired
    private PasswordEncoder passwordEncoder; // AGREGAR ESTO

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión", description = "Autenticar usuario y obtener token JWT")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody AuthRequestDTO request) {
        AuthResponseDTO response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/registro/visitante")
    @Operation(summary = "Registrar visitante", description = "Crear cuenta de visitante y obtener token JWT")
    public ResponseEntity<AuthResponseDTO> registrarVisitante(@Valid @RequestBody VisitanteRequestDTO request) {
        AuthResponseDTO response = authService.registrarVisitante(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/registro/guia")
    @Operation(summary = "Registrar guía", description = "Crear cuenta de guía (solo ADMIN)")
    public ResponseEntity<AuthResponseDTO> registrarGuia(@Valid @RequestBody GuiaRequestDTO request) {
        AuthResponseDTO response = authService.registrarGuia(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/cambiar-password")
    @Operation(summary = "Cambiar contraseña", description = "Cambiar contraseña del usuario autenticado")
    public ResponseEntity<ApiResponseDTO<Void>> cambiarPassword(
            @RequestParam Long usuarioId,
            @RequestParam String passwordActual,
            @RequestParam String passwordNueva) {

        authService.cambiarPassword(usuarioId, passwordActual, passwordNueva);
        return ResponseEntity.ok(ApiResponseDTO.success("Contraseña cambiada exitosamente"));
    }

    // AGREGAR ESTE MÉTODO TEMPORAL
    @GetMapping("/generate-hash")
    @Operation(summary = "Generar hash BCrypt (TEMPORAL - BORRAR EN PRODUCCIÓN)")
    public ResponseEntity<String> generateHash(@RequestParam String password) {
        String hash = passwordEncoder.encode(password);
        return ResponseEntity.ok(hash);
    }
}
