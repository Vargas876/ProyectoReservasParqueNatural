package com.uptc.bases2.demo.controllers;

import com.uptc.bases2.demo.models.dto.request.GuiaRequestDTO;
import com.uptc.bases2.demo.models.dto.response.AgendaGuiaResponseDTO;
import com.uptc.bases2.demo.models.dto.response.ApiResponseDTO;
import com.uptc.bases2.demo.models.dto.response.GuiaResponseDTO;
import com.uptc.bases2.demo.services.interfaces.GuiaService;
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
 * Controlador para gestión de guías
 */
@RestController
@RequestMapping("/guias")
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Guías", description = "Gestión de guías turísticos")
public class GuiaController {

    @Autowired
    private GuiaService guiaService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Crear nuevo guía")
    public ResponseEntity<GuiaResponseDTO> crear(@Valid @RequestBody GuiaRequestDTO request) {
        GuiaResponseDTO guia = guiaService.crear(request);
        return new ResponseEntity<>(guia, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'GUIA')")
    @Operation(summary = "Obtener guía por ID")
    public ResponseEntity<GuiaResponseDTO> obtenerPorId(@PathVariable Long id) {
        GuiaResponseDTO guia = guiaService.obtenerPorId(id);
        return ResponseEntity.ok(guia);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Listar todos los guías")
    public ResponseEntity<List<GuiaResponseDTO>> obtenerTodos() {
        List<GuiaResponseDTO> guias = guiaService.obtenerTodos();
        return ResponseEntity.ok(guias);
    }

    @GetMapping("/activos")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Listar guías activos")
    public ResponseEntity<List<GuiaResponseDTO>> obtenerActivos() {
        List<GuiaResponseDTO> guias = guiaService.obtenerActivos();
        return ResponseEntity.ok(guias);
    }

    @GetMapping("/disponibles")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Obtener guías disponibles para una fecha")
    public ResponseEntity<List<GuiaResponseDTO>> obtenerDisponibles(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        
        List<GuiaResponseDTO> guias = guiaService.obtenerDisponiblesPorFecha(fecha);
        return ResponseEntity.ok(guias);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Actualizar datos del guía")
    public ResponseEntity<GuiaResponseDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody GuiaRequestDTO request) {
        
        GuiaResponseDTO guia = guiaService.actualizar(id, request);
        return ResponseEntity.ok(guia);
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Cambiar estado del guía")
    public ResponseEntity<ApiResponseDTO<Void>> cambiarEstado(
            @PathVariable Long id,
            @RequestParam String nuevoEstado) {
        
        guiaService.cambiarEstado(id, nuevoEstado);
        return ResponseEntity.ok(ApiResponseDTO.success("Estado actualizado exitosamente"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Eliminar guía (lógico)")
    public ResponseEntity<ApiResponseDTO<Void>> eliminar(@PathVariable Long id) {
        guiaService.eliminar(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Guía eliminado exitosamente"));
    }

    @GetMapping("/{id}/agenda")
    @PreAuthorize("hasAnyRole('ADMIN', 'GUIA')")
    @Operation(summary = "Obtener agenda del guía por fecha")
    public ResponseEntity<AgendaGuiaResponseDTO> obtenerAgenda(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        
        AgendaGuiaResponseDTO agenda = guiaService.obtenerAgenda(id, fecha);
        return ResponseEntity.ok(agenda);
    }

    @GetMapping("/{id}/puede-tomar-recorrido")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Verificar si puede tomar más recorridos en una fecha")
    public ResponseEntity<ApiResponseDTO<Boolean>> puedeTomarRecorrido(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        
        boolean puede = guiaService.puedeTomarRecorrido(id, fecha);
        return ResponseEntity.ok(ApiResponseDTO.success("Verificación exitosa", puede));
    }
}
