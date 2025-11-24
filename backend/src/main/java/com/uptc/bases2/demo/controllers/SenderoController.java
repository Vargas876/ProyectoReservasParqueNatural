package com.uptc.bases2.demo.controllers;

import com.uptc.bases2.demo.models.dto.request.SenderoRequestDTO;
import com.uptc.bases2.demo.models.dto.response.ApiResponseDTO;
import com.uptc.bases2.demo.models.dto.response.SenderoResponseDTO;
import com.uptc.bases2.demo.services.interfaces.SenderoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Controlador para gestión de senderos
 */
@RestController
@RequestMapping("/senderos")
@Tag(name = "Senderos", description = "Gestión de senderos del parque")
public class SenderoController {

    @Autowired
    private SenderoService senderoService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Crear nuevo sendero")
    public ResponseEntity<SenderoResponseDTO> crear(@Valid @RequestBody SenderoRequestDTO request) {
        SenderoResponseDTO sendero = senderoService.crear(request);
        return new ResponseEntity<>(sendero, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener sendero por ID")
    public ResponseEntity<SenderoResponseDTO> obtenerPorId(@PathVariable Long id) {
        SenderoResponseDTO sendero = senderoService.obtenerPorId(id);
        return ResponseEntity.ok(sendero);
    }

    @GetMapping
    @Operation(summary = "Listar todos los senderos")
    public ResponseEntity<List<SenderoResponseDTO>> obtenerTodos() {
        List<SenderoResponseDTO> senderos = senderoService.obtenerTodos();
        return ResponseEntity.ok(senderos);
    }

    @GetMapping("/activos")
    @Operation(summary = "Listar senderos activos (público)")
    public ResponseEntity<List<SenderoResponseDTO>> obtenerActivos() {
        List<SenderoResponseDTO> senderos = senderoService.obtenerActivos();
        return ResponseEntity.ok(senderos);
    }

    @GetMapping("/disponibles")
    @Operation(summary = "Obtener senderos disponibles para una fecha")
    public ResponseEntity<List<SenderoResponseDTO>> obtenerDisponibles(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        
        List<SenderoResponseDTO> senderos = senderoService.obtenerDisponibles(fecha);
        return ResponseEntity.ok(senderos);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Actualizar sendero")
    public ResponseEntity<SenderoResponseDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody SenderoRequestDTO request) {
        
        SenderoResponseDTO sendero = senderoService.actualizar(id, request);
        return ResponseEntity.ok(sendero);
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Cambiar estado del sendero")
    public ResponseEntity<ApiResponseDTO<Void>> cambiarEstado(
            @PathVariable Long id,
            @RequestParam String nuevoEstado) {
        
        senderoService.cambiarEstado(id, nuevoEstado);
        return ResponseEntity.ok(ApiResponseDTO.success("Estado actualizado exitosamente"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Eliminar sendero (lógico)")
    public ResponseEntity<ApiResponseDTO<Void>> eliminar(@PathVariable Long id) {
        senderoService.eliminar(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Sendero eliminado exitosamente"));
    }

    @GetMapping("/{id}/cupo-disponible")
    @Operation(summary = "Calcular cupo disponible para una fecha")
    public ResponseEntity<ApiResponseDTO<Integer>> calcularCupoDisponible(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        
        Integer cupo = senderoService.calcularCupoDisponible(id, fecha);
        return ResponseEntity.ok(ApiResponseDTO.success("Cupo calculado", cupo));
    }
}
