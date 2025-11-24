package com.uptc.bases2.demo.controllers;

import com.uptc.bases2.demo.models.dto.request.VisitanteRequestDTO;
import com.uptc.bases2.demo.models.dto.response.ApiResponseDTO;
import com.uptc.bases2.demo.models.dto.response.VisitanteResponseDTO;
import com.uptc.bases2.demo.services.interfaces.VisitanteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador para gestión de visitantes
 */
@RestController
@RequestMapping("/visitantes")
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Visitantes", description = "Gestión de visitantes del parque")
public class VisitanteController {

    @Autowired
    private VisitanteService visitanteService;

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VISITANTE')")
    @Operation(summary = "Obtener visitante por ID")
    public ResponseEntity<VisitanteResponseDTO> obtenerPorId(@PathVariable Long id) {
        VisitanteResponseDTO visitante = visitanteService.obtenerPorId(id);
        return ResponseEntity.ok(visitante);
    }

    @GetMapping("/email/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Buscar visitante por email")
    public ResponseEntity<VisitanteResponseDTO> obtenerPorEmail(@PathVariable String email) {
        VisitanteResponseDTO visitante = visitanteService.obtenerPorEmail(email);
        return ResponseEntity.ok(visitante);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Listar todos los visitantes")
    public ResponseEntity<List<VisitanteResponseDTO>> obtenerTodos() {
        List<VisitanteResponseDTO> visitantes = visitanteService.obtenerTodos();
        return ResponseEntity.ok(visitantes);
    }

    @GetMapping("/activos")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Listar visitantes activos")
    public ResponseEntity<List<VisitanteResponseDTO>> obtenerActivos() {
        List<VisitanteResponseDTO> visitantes = visitanteService.obtenerActivos();
        return ResponseEntity.ok(visitantes);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'VISITANTE')")
    @Operation(summary = "Actualizar datos del visitante")
    public ResponseEntity<VisitanteResponseDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody VisitanteRequestDTO request) {
        
        VisitanteResponseDTO visitante = visitanteService.actualizar(id, request);
        return ResponseEntity.ok(visitante);
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Cambiar estado del visitante")
    public ResponseEntity<ApiResponseDTO<Void>> cambiarEstado(
            @PathVariable Long id,
            @RequestParam String nuevoEstado) {
        
        visitanteService.cambiarEstado(id, nuevoEstado);
        return ResponseEntity.ok(ApiResponseDTO.success("Estado actualizado exitosamente"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Eliminar visitante (lógico)")
    public ResponseEntity<ApiResponseDTO<Void>> eliminar(@PathVariable Long id) {
        visitanteService.eliminar(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Visitante eliminado exitosamente"));
    }

    @GetMapping("/{id}/puede-reservar")
    @PreAuthorize("hasAnyRole('ADMIN', 'VISITANTE')")
    @Operation(summary = "Verificar si puede hacer más reservas")
    public ResponseEntity<ApiResponseDTO<Boolean>> puedeHacerReserva(@PathVariable Long id) {
        boolean puede = visitanteService.puedeHacerReserva(id);
        return ResponseEntity.ok(ApiResponseDTO.success("Verificación exitosa", puede));
    }
}
